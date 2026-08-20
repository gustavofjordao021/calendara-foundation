require 'json'

Pod::Spec.new do |s|
  s.name           = 'CalendaraEventKit'
  s.version        = '0.1.0'
  s.summary        = 'CLND-506: EventKit external identifiers, store-changed events, BGAppRefreshTask'
  s.description    = 'Closes the three gaps expo-calendar leaves for two-way Apple Calendar sync.'
  s.author         = 'Calendara'
  s.homepage       = 'https://usecalendara.com'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks     = 'EventKit', 'BackgroundTasks'
  s.source_files   = '**/*.{h,m,swift}'
end
