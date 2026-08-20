// CLND-506 spike draft — the small native module that closes the three gaps
// expo-calendar leaves (verified absent through v57.0.0):
//   1. calendarItemExternalIdentifier (cross-device identity + iCal-UID echo guard)
//   2. EKEventStoreChanged subscription (foreground freshness signal)
//   3. BGAppRefreshTask registration (real daytime background refresh — CLND-515)
//
// Modeled on modules/apple-ads-attribution (the shipped Expo Modules API precedent).
// DRAFT quality: compiles-by-inspection, not yet built. BGTask registration must run
// at app launch — see the note on registerBackgroundRefresh below.

import ExpoModulesCore
import EventKit
#if canImport(BackgroundTasks)
import BackgroundTasks
#endif

internal class CalendarAccessException: Exception {
  override var reason: String { "Calendar access not granted" }
  override var code: String { "ERR_CALENDAR_ACCESS" }
}

public class CalendaraEventKitModule: Module {
  private let store = EKEventStore()
  private var storeObserver: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("CalendaraEventKit")

    Events("onStoreChanged")

    OnStartObserving {
      self.storeObserver = NotificationCenter.default.addObserver(
        forName: .EKEventStoreChanged, object: self.store, queue: .main
      ) { [weak self] _ in
        // EKEventStoreChanged carries no payload by design — the import loop
        // must refetch its window (Apple's documented guidance).
        self?.sendEvent("onStoreChanged", [:])
      }
    }

    OnStopObserving {
      if let observer = self.storeObserver {
        NotificationCenter.default.removeObserver(observer)
        self.storeObserver = nil
      }
    }

    // Per-occurrence identity for a window: the fields expo-calendar hides.
    // Returns one entry PER OCCURRENCE (eventsMatching expands recurring series),
    // with the shared eventIdentifier, the cross-device external identifier, and
    // the occurrence date — everything CLND-508's composite key needs.
    AsyncFunction("getEventIdentity") { (calendarIds: [String], startISO: String, endISO: String) -> [[String: Any?]] in
      guard EKEventStore.authorizationStatus(for: .event) == .fullAccess ||
            EKEventStore.authorizationStatus(for: .event) == .authorized else {
        throw CalendarAccessException()
      }
      let fmt = ISO8601DateFormatter()
      guard let start = fmt.date(from: startISO), let end = fmt.date(from: endISO) else { return [] }
      let calendars = calendarIds.compactMap { self.store.calendar(withIdentifier: $0) }
      let predicate = self.store.predicateForEvents(withStart: start, end: end, calendars: calendars.isEmpty ? nil : calendars)
      return self.store.events(matching: predicate).map { e in
        [
          "eventIdentifier": e.eventIdentifier,                       // shared across occurrences
          "externalIdentifier": e.calendarItemExternalIdentifier,     // iCloud-stable; ICS UID for subscribed feeds
          "occurrenceDate": e.occurrenceDate.map { fmt.string(from: $0) },
          "startDate": fmt.string(from: e.startDate),
          "isDetached": e.isDetached,
          "hasRecurrenceRules": e.hasRecurrenceRules,
          "recurrenceRule": e.recurrenceRules?.first.map { String(describing: $0) },
          "lastModified": e.lastModifiedDate.map { fmt.string(from: $0) },
          "calendarId": e.calendar?.calendarIdentifier,
        ]
      }
    }

    // Calendar metadata expo-calendar under-reports: native EKCalendarType
    // (subscription/birthday split), immutability, and subscription status.
    AsyncFunction("getCalendarNativeInfo") { () -> [[String: Any?]] in
      return self.store.calendars(for: .event).map { c in
        [
          "id": c.calendarIdentifier,
          "title": c.title,
          "type": Self.typeName(c.type),                 // local|calDAV|exchange|subscription|birthday
          "sourceType": Self.sourceTypeName(c.source.sourceType),
          "sourceTitle": c.source.title,
          "isSubscribed": c.isSubscribed,
          "isImmutable": c.isImmutable,
          "allowsContentModifications": c.allowsContentModifications,
        ]
      }
    }

    // BGAppRefreshTask — the REAL daytime primitive (expo-background-task
    // schedules BGProcessingTask instead). NOTE: BGTaskScheduler.register must
    // be called before application(_:didFinishLaunching:) returns — in the final
    // implementation this moves to an AppDelegate subscriber / config plugin;
    // exposed here so the spike can validate scheduling semantics on device.
    AsyncFunction("scheduleAppRefresh") { (identifier: String, earliestSeconds: Double) -> Bool in
      #if canImport(BackgroundTasks)
      let request = BGAppRefreshTaskRequest(identifier: identifier)
      request.earliestBeginDate = Date(timeIntervalSinceNow: earliestSeconds)
      do { try BGTaskScheduler.shared.submit(request); return true } catch { return false }
      #else
      return false
      #endif
    }
  }

  private static func typeName(_ t: EKCalendarType) -> String {
    switch t {
    case .local: return "local"
    case .calDAV: return "calDAV"
    case .exchange: return "exchange"
    case .subscription: return "subscription"
    case .birthday: return "birthday"
    @unknown default: return "unknown"
    }
  }

  private static func sourceTypeName(_ t: EKSourceType) -> String {
    switch t {
    case .local: return "local"
    case .exchange: return "exchange"
    case .calDAV: return "calDAV"
    case .mobileMe: return "mobileMe"
    case .subscribed: return "subscribed"
    case .birthdays: return "birthdays"
    @unknown default: return "unknown"
    }
  }
}
