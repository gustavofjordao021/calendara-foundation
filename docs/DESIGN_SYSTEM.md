# Calendara Mobile Design System

## Brand Colors

### Primary
- **Primary**: `#c96442` (Coral)
- **Primary Hover**: `#b85a3b`
- **Primary Light**: `rgba(201, 100, 66, 0.1)`

### Backgrounds
- **Background**: `#FFFFFF`
- **Background Secondary**: `#F2F2F7`

### Text
- **Text Primary**: `#1C1C1E`
- **Text Secondary**: `#8E8E93`
- **Text Tertiary**: `#AEAEB2`
- **Text Inverse**: `#FFFFFF`

### Status Colors
- **Destructive**: `#FF3B30`
- **Success**: `#34C759`
- **Warning**: `#FF9500`

### Borders
- **Border**: `#E5E5EA`
- **Border Light**: `#F2F2F7`

## Typography

### Font Family
- **Regular**: Manrope-Regular
- **Medium**: Manrope-Medium
- **SemiBold**: Manrope-SemiBold
- **Bold**: Manrope-Bold

### Font Sizes
| Token | Size |
|-------|------|
| xs | 12px |
| sm | 14px |
| md | 16px |
| lg | 18px |
| xl | 20px |
| xxl | 24px |
| xxxl | 32px |

## Spacing

| Token | Size |
|-------|------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| xxl | 24px |
| xxxl | 32px |

## Border Radius

| Token | Size |
|-------|------|
| sm | 4px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

## Touch Targets

- **Minimum Height**: 44px
- **Minimum Width**: 44px

(Per iOS Human Interface Guidelines)

## Icon System

Using `@expo/vector-icons` (Ionicons + Feather):

| Semantic Name | Icon |
|---------------|------|
| home | home-outline |
| calendar | calendar-outline |
| settings | settings-outline |
| camera | camera-outline |
| image | image-outline |
| upload | cloud-upload-outline |
| edit | edit-2 (Feather) |
| trash | trash-2 (Feather) |
| check | checkmark |
| close | close |
| add | add |
| sparkles | sparkles |
| clock | clock (Feather) |
| mapPin | map-pin (Feather) |
| user | user (Feather) |
| logOut | log-out (Feather) |
| alertCircle | alert-circle (Feather) |

## Usage

```tsx
import { useTheme } from '../theme/ThemeProvider';
import { colors, spacing, typography } from '../theme';

// In component
const { colors, spacing, typography } = useTheme();

// Apply styles
style={{
  backgroundColor: colors.primary,
  padding: spacing.md,
  fontFamily: typography.fontFamily.semiBold,
  fontSize: typography.fontSize.md,
}}
```
