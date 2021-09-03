# Statistics

## Requirements

> Statistiksidan
>
> - Statistik för kurs-PM är till för att se hur vi uppfyller effektmålen
> - Borde ha två siffror. Uppladdade innan kursstart, och efter
> - Eller minst 1 vecka innan, mellan 1 vecka innan – dagen för kursstart, efter kursstart
>
> Eventuellt knoppas av till egen task.

## Analysis

### Course Start in kursinfo-admin-web

- Courses from `/api/kopps/v2/courses/offerings` contains `offered_semesters` with a list of just that. Use `start_date` from the object with matching `semester`.

### Published Date in kurs-pm-data-api

- Course memo data from `/api/kurs-pm-data/v1/webAndPdfPublishedMemosBySemester/` contains `lastChangeDate`.
- For web based memos, use `lastChangeDate`. Retrieve all wtih `status` `old` or `published` and use the one with `version` `1`.
- For pdf memos use `lastChangeDate` until there’s a versioning system.
