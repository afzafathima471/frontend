# Asset_valet Frontend Architecture (Next.js)

Role: IT Administrator (Full access to manage assets, employees, assignments, and reports)

Page: /login (Authentication page for admin access)

Component: <AuthLayout /> - Centered authentication wrapper layout.

Component: <AuthForm /> - Login form with email and password fields.

Page: /dashboard (Main landing page after successful login)

Component: <Sidebar /> - Navigation links (Dashboard, Assets, Employees, Assignments, Reports).

Component: <TopNavbar /> - Displays logged-in admin name and logout button.

Component: <StatCards /> - 3–4 cards showing Total Assets, Assigned Assets, Available Assets, Under Maintenance.

Component: <RecentAssignmentsTable /> - Mini-table showing the latest 5 asset assignments.

Component: <QuickActionsPanel /> - Quick buttons (Add Asset, Add Employee, Assign Asset).

Page: /assets (Manage all company assets)

Component: <Sidebar /> - Reused navigation component.

Component: <TopNavbar /> - Reused header component.

Component: <AssetDataTable /> - Large data table with search, filter, sorting, and pagination.

Component: <AddAssetModal /> - Modal form to add a new asset.

Component: <EditAssetModal /> - Modal form to update asset details.

Component: <DeleteAssetDialog /> - Confirmation dialog before deleting asset.

Page: /employees (Manage company employees)

Component: <Sidebar /> - Reused navigation component.

Component: <TopNavbar /> - Reused header component.

Component: <EmployeeDataTable /> - Table listing all employees.

Component: <AddEmployeeModal /> - Modal to add new employee.

Component: <EditEmployeeModal /> - Modal to edit employee information.

Component: <DeleteEmployeeDialog /> - Confirmation dialog before deletion.

Page: /assignments (Assign and track asset allocation)

Component: <Sidebar /> - Reused navigation component.

Component: <TopNavbar /> - Reused header component.

Component: <AssignmentTable /> - Displays all asset assignments with status.

Component: <AssignAssetModal /> - Form to assign asset to an employee.

Component: <ReturnAssetModal /> - Modal to mark asset as returned.

Component: <FilterBar /> - Filter assignments by employee, asset type, and status.

Page: /reports (View asset reports and history)

Component: <Sidebar /> - Reused navigation component.

Component: <TopNavbar /> - Reused header component.

Component: <ConditionReportTable /> - Displays asset condition and maintenance history.

Component: <GenerateReportButton /> - Button to download CSV or PDF reports.

Role: Standard Employee (Can only view assigned assets and report issues)

Page: /login (Authentication page for employee access)

Component: <AuthLayout /> - Reused authentication layout.

Component: <AuthForm /> - Login form.

Page: /my-dashboard (Employee landing page after login)

Component: <TopNavbar /> - Displays employee name and logout button.

Component: <MyAssetSummaryCard /> - Card showing total assets assigned.

Component: <RecentActivityFeed /> - Displays recent assignment or return history.

Page: /my-assets (View all assigned assets)

Component: <TopNavbar /> - Reused header component.

Component: <MyAssetList /> - Grid or list view of assigned assets.

Component: <AssetCard /> - Individual asset display card with basic details.

Component: <ReportIssueButton /> - Button to open issue reporting form.

Page: /report-issue (Submit issue for assigned asset)

Component: <TopNavbar /> - Reused header component.

Component: <IssueForm /> - Form to submit asset issue description.

Component: <SubmitButton /> - Button to submit issue ticket.
