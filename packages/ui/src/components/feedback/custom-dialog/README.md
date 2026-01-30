# CustomDialog

A flexible dialog component built on top of MUI Dialog with customizable title, description, actions, and content areas.

## Basic Usage

```tsx
import { CustomDialog } from '@asyml8/ui';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <CustomDialog
        open={open}
        onClose={() => setOpen(false)}
        title="My Dialog"
      >
        <p>Dialog content goes here</p>
      </CustomDialog>
    </>
  );
}
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | **Required.** Controls dialog visibility |
| `onClose` | `() => void` | - | **Required.** Called when dialog should close |
| `children` | `React.ReactNode` | - | Dialog content |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Maximum dialog width |
| `fullWidth` | `boolean` | `true` | Whether dialog takes full width up to maxWidth |

### Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Dialog title text |
| `description` | `string` | - | Subtitle/description text below title |
| `showCloseButton` | `boolean` | `true` | Show close button in header |
| `closeIcon` | `React.ReactNode` | Default X icon | Custom close button icon |

### Action Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `React.ReactNode` | - | Action buttons in footer |

## Examples

### Simple Confirmation Dialog

```tsx
<CustomDialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="Delete User"
  description="Are you sure you want to delete this user? This action cannot be undone."
  actions={
    <>
      <Button onClick={() => setConfirmOpen(false)}>
        Cancel
      </Button>
      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
/>
```

### Form Dialog

```tsx
<CustomDialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  title="Edit Profile"
  description="Update your profile information below."
  maxWidth="md"
  actions={
    <>
      <Button onClick={() => setFormOpen(false)}>
        Cancel
      </Button>
      <Button variant="contained" onClick={handleSave}>
        Save Changes
      </Button>
    </>
  }
>
  <TextField fullWidth label="Name" sx={{ mb: 2 }} />
  <TextField fullWidth label="Email" type="email" sx={{ mb: 2 }} />
  <TextField fullWidth label="Bio" multiline rows={3} />
</CustomDialog>
```

### Large Content Dialog

```tsx
<CustomDialog
  open={detailsOpen}
  onClose={() => setDetailsOpen(false)}
  title="User Details"
  maxWidth="lg"
  showCloseButton={true}
>
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6">Personal Information</Typography>
          {/* User details */}
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6">Account Settings</Typography>
          {/* Account settings */}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</CustomDialog>
```

### Dialog Without Title

```tsx
<CustomDialog
  open={alertOpen}
  onClose={() => setAlertOpen(false)}
  actions={
    <Button variant="contained" onClick={() => setAlertOpen(false)}>
      OK
    </Button>
  }
>
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Operation Completed
    </Typography>
    <Typography color="text.secondary">
      Your changes have been saved successfully.
    </Typography>
  </Box>
</CustomDialog>
```

### Custom Close Icon

```tsx
<CustomDialog
  open={customOpen}
  onClose={() => setCustomOpen(false)}
  title="Custom Close Icon"
  closeIcon={<CloseIcon />}
>
  <p>This dialog uses a custom close icon.</p>
</CustomDialog>
```

## Size Guidelines

- **xs (444px)**: Small alerts, confirmations
- **sm (600px)**: Default, simple forms
- **md (900px)**: Complex forms, user profiles
- **lg (1200px)**: Data tables, dashboards
- **xl (1536px)**: Full-screen content

## Best Practices

1. **Always provide onClose** - Even if no close button is shown
2. **Use descriptions** - Help users understand the dialog's purpose
3. **Consistent actions** - Cancel on left, primary action on right
4. **Appropriate sizing** - Choose maxWidth based on content needs
5. **Accessible titles** - Use clear, descriptive titles

## Integration with Forms

The CustomDialog works seamlessly with FormBuilder and EnhancedFormBuilder:

```tsx
<CustomDialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  title="User Form"
  description="Manage user account information."
  maxWidth="md"
>
  <EnhancedFormBuilder
    fields={userFields}
    store={userFormStore}
    mode="create"
    hideSubmitButton={false}
  />
</CustomDialog>
```
