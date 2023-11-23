
## Dummy Company

From the landing page, select to register as a new user or [click here](https://dummy-company-9db6d773420a.herokuapp.com/register).
Dummy Company users will be greated with a dashboard showing the lasted information– Imagine the possibilities!

## Leave Manager

Select the Leave Manager on the top navigation bar.

### Pagination

Results are limited to 10 results per page and server-side paginated. Select next at the bottom of the table or click a particular page.

### Sorting

The following column headings are clickable to sort. 
- Employee
- Leave Type
- Start Date
- End Date
- Total Days

### Filtering and Searching

Select an employee from the list. This list has autocomplete search because there would likely be more than 10 employees in a real organisation.

The search box searches the reason field.

The date range will find an results that intersect the provided range.

### Sorting and Filtering and Searching

All sorting, filtering and searching is performed server-side but updated reactively. All sort, filter and search options can be combined and are powered by url query parameters for bookmark/url friendly results.

## Adding an entry

All validation is performed server-side and feedback is provided reactively. 

I have provided an invalid user to demonstrate that ui-restricted select fields are also protected from request tampering- ie. the server doesnt just assume the data is valid.

Selecting multiple days will return whole number days and disable the hour fields. Selected the same end day will enable the hour fields are allow you to select up to a maximum of 8 hours (1 day). I have allowed the user interface to create negative total days to demonstrate that those cases are handled server-side.

Leave requests may not overlap with existing entries.

## Viewing/editing the entry

The latest leave will be highlighted on returning to the leave manager page. All entries are editable from the actions column.
