# How to Communicate Effectively with AI for Code Tasks

## The Problem
AI often creates custom solutions instead of following existing patterns, leading to wasted time and incorrect implementations.

## What You Should Have Asked

### ❌ What You Actually Asked
> "can we use zod for validation on this, too /Users/.../organization-list-view.config.tsx"

**Why this failed:**
- Too vague
- No reference to existing patterns
- Allowed me to improvise
- No constraints on implementation approach

### ✅ What You Should Have Asked
> "Add Zod validation to the organization address form. Follow the exact pattern from `contact.form.ts`:
> 1. Create `organization-address.form.ts` using `createAppFormStore`
> 2. Include schema, fetchFn, updateFn, and invalidateQueries
> 3. Use NAME_CHARS_REGEX for city/state/county
> 4. Add ADDRESS_REGEX for address lines
> 5. Update the view to use the store like `contact-form-drawer.tsx` does"

**Why this works:**
- ✅ Specific file to follow as template
- ✅ Exact pattern to use (`createAppFormStore`)
- ✅ Lists required components
- ✅ References existing validation constants
- ✅ Points to example usage

## General Formula for Effective Requests

```
[ACTION] + [SPECIFIC PATTERN/FILE TO FOLLOW] + [KEY REQUIREMENTS]
```

### Examples

#### ❌ Bad Request
"Add a phone field to the form builder"

#### ✅ Good Request
"Add a `businessPhone` field type to form-builder.tsx. Follow the existing `phone` field pattern (line 302) but use `formatBusinessPhone` from phone.util.ts instead of PhoneInput component."

---

#### ❌ Bad Request
"Remove the onKeyPress handlers"

#### ✅ Good Request
"Remove all onKeyPress handlers from contact-form-drawer.tsx and add Zod regex validation to contact.form.ts schema instead. Use NAME_CHARS_REGEX from validation.ts for firstName, lastName, and jobTitle fields."

---

#### ❌ Bad Request
"Fix the TypeScript error"

#### ✅ Good Request
"The EnhancedFormBuilder doesn't accept a `form` prop. Check how contact-form-drawer.tsx uses it (line 267) - it passes a `store` prop created with `createAppFormStore`. Do the same for organization."

## Key Principles

### 1. Always Reference Existing Code
- ❌ "Create a form store"
- ✅ "Create a form store like `contact.form.ts` (lines 56-170)"

### 2. Specify the Pattern/Tool to Use
- ❌ "Add validation"
- ✅ "Add validation using `createAppFormStore` with Zod schema"

### 3. List Concrete Requirements
- ❌ "Make it work properly"
- ✅ "Include: schema with regex, fetchFn, updateFn, invalidateQueries"

### 4. Point to Examples of Usage
- ❌ "Use it in the component"
- ✅ "Pass it to EnhancedFormBuilder like line 267 in contact-form-drawer.tsx"

### 5. Interrupt Early When I Go Wrong
- ❌ Let me finish the wrong implementation
- ✅ "STOP - check existing patterns first before implementing"

## Red Flags That Mean You Should Intervene

If I say any of these, stop me immediately:

- "Let me create a custom solution..."
- "I'll implement this differently..."
- "We can do this manually..."
- "Let me add a new approach..."

**Correct response:** "No - find and follow the existing pattern first."

## Template for Complex Tasks

```markdown
Task: [What needs to be done]

Reference Implementation: [Specific file and lines]

Pattern to Follow: [Exact tool/function/approach]

Requirements:
1. [Specific requirement with example]
2. [Specific requirement with example]
3. [Specific requirement with example]

Validation:
- Check that [specific thing] matches [reference file]
- Ensure [specific thing] follows [pattern]
```

## Example Using This Template

```markdown
Task: Add Zod validation to organization address form

Reference Implementation: src/store/forms/contact.form.ts (lines 56-170)

Pattern to Follow: createAppFormStore from @asyml8/ui

Requirements:
1. Create organization-address.form.ts with organizationAddressSchema
2. Use NAME_CHARS_REGEX for city, state, county (like firstName in contact.form.ts line 23)
3. Use ADDRESS_REGEX for addressLine1, addressLine2
4. Use POSTAL_CODE_REGEX for postalCode
5. Include fetchFn using fluxServices.accounts.getAccountsById
6. Include updateFn using fluxServices.accounts.updateAccountsById with withNotifications
7. Include invalidateQueries: [accountsQuery]

Validation:
- Check that the store structure matches contactFormStore
- Ensure the view uses it like contact-form-drawer.tsx line 267
```

## Bottom Line

**Before asking me to implement anything, ask yourself:**
1. Does this pattern already exist in the codebase?
2. Can I point to a specific file/function that does something similar?
3. Have I specified the exact tool/pattern to use?

If you can't answer all three, refine your request first.
