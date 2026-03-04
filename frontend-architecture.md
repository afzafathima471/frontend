# OptiAsset Frontend Architecture (Next.js)

---

## Role: IT Administrator
(Full access to manage assets, employees, and assignments)

### Page: /login
Component: <AuthForm /> - Login form with email and password.
Component: <AuthLayout /> - Centered authentication layout wrapper.

---

### Page: /dashboard
Component: <Sidebar /> - Navigation links (Dashboard, Assets, Employees, Assignments, Reports).
Component: <TopNavbar /> - Displays logged-in admin name and logout button.
Component: <StatCards /> - Cards showing Total Assets, Assigned Assets, Available Assets.
Component: <RecentAssignmentsTable /> - Table showing last 5 asset assignments.
Component: <QuickActionsPanel /> - Buttons (Add Asset, Add Employee, Assign Asset).

---

### Page: /assets
Component: <Sidebar /> - Reused navigation.
Component: <TopNavbar /> - Reused header.
Component: <AssetDataTable /> - Full asset table with search, filter, pagination.
Component: <AddAssetModal /> - Modal form to add new asset.
Component: <EditAssetModal /> - Modal to update asset details.
Component: <DeleteAssetDialog /> - Confirmation dialog.

---

### Page: /employees
Component: <Sidebar />
Component: <TopNavbar />
Component: <EmployeeDataTable /> - List of employees.
Component: <AddEmployeeModal />
Component: <EditEmployeeModal />
Component: <DeleteEmployeeDialog />

---

### Page: /assignments
Component: <Sidebar />
Component: <TopNavbar />
Component: <AssignmentTable /> - Shows all asset assignments.
Component: <AssignAssetModal /> - Assign asset to employee.
Component: <ReturnAssetModal /> - Mark asset as returned.
Component: <FilterBar /> - Filter by employee, asset type, status.

---

### Page: /reports
Component: <Sidebar />
Component: <TopNavbar />
Component: <ConditionReportTable /> - Displays asset condition history.
Component: <GenerateReportButton /> - Download CSV/PDF option.

---

## Role: Standard Employee
(Can only view assigned assets and report issues)

### Page: /my-dashboard
Component: <TopNavbar />
Component: <MyAssetSummaryCard /> - Shows total assets assigned.
Component: <RecentActivityFeed /> - Shows assignment history.

---

### Page: /my-assets
Component: <TopNavbar />
Component: <MyAssetList /> - Grid or list of assigned assets.
Component: <AssetCard /> - Individual asset display card.
Component: <ReportIssueButton /> - Opens issue modal.

---

### Page: /report-issue
Component: <TopNavbar />
Component: <IssueForm /> - Form to submit asset problem.
Component: <SubmitButton />