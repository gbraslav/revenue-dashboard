# Spec for Activities Page

branch: claude/feature/activities-page

## Summary
Build out the activities page to display all activities currently shown in the dashboard's "Recent Activities" component, fetched from the existing activities API. Each activity should include an additional "description" field providing a detailed explanation of that activity.

## Functional Requirements
- The activities page (already stubbed at `/activities`) should fetch data from the `/api/activities` endpoint and render the full list of activities.
- Each activity should display all existing fields: icon, title, category, time, and status.
- Each activity should also display a new `description` field — a longer text providing detail about the activity.
- The activities API response should be extended to include a `description` string for each activity.
- The page should reuse the same status color scheme (Completed = green, Urgent = red, In Progress = blue) as the dashboard's Recent Activities component.
- The "View All Tasks" link on the dashboard Recent Activities component should navigate to this page.

## Possible Edge Cases
- Empty activities list — display a meaningful empty state message.
- Very long descriptions — ensure text wraps gracefully and does not break the layout.
- API fetch failure — show an error or fallback state.

## Acceptance Criteria
- Navigating to `/activities` shows all activities returned by the API.
- Each activity card/row includes the description field.
- The API response includes the description field for every activity.
- The dashboard "View All Tasks" link navigates to `/activities`.
- Layout is consistent with the overall dashboard design.

## Open Questions
- Should descriptions be truncatable/expandable, or always fully visible? expandable
- Should the activities page support filtering or sorting (e.g., by status or category)? add both

# Testing Guidelines
Create a test file(s) in the ./test folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- API returns activities with description field present on each item.
- Activities page renders all activities from the API.
- Each activity displays the description text.
- Empty state is shown when no activities are returned.
