Asset_valet frontend Architecture

Role: IT Administrator (Full access to manage assets, employees, assignments, and reports)

    Page: /login (Authentication page for admin access)

        Component: `<AuthLayout />` - Centered authentication wrapper layout.

        Component: `<AuthForm />` - Login form with email and password fields.

    Page: /dashboard (The main landing page after login)

        Component: `<Sidebar />` - Navigation links (Dashboard, Assets, Employees, Assignments, Reports).

        Component: `<TopNavbar />` - Shows logged-in admin profile and logout button.

        Component: `<StatCards />` - 4 blocks showing Total Assets, Assigned Assets, Available Assets, and Under Maintenance.

        Component: `<RecentAssignmentsTable />` - A mini-table showing the last 5 asset assignments.

        Component: `<QuickActionsPanel />` - Quick buttons to Add Asset, Add Employee, and Assign Asset.

    Page: /assets (The page to manage all company assets)

        Component: `<Sidebar />` - (Reused from dashboard).

        Component: `<TopNavbar />` - (Reused from dashboard).

        Component: `<AssetDataTable />` - A large table with search, filter, sorting, and pagination.

        Component: `<AddAssetModal />` - A popup form to add a new asset to the database.

        Component: `<EditAssetModal />` - A popup form to update asset details.

        Component: `<DeleteAssetDialog />` - A confirmation dialog before deleting an asset.

    Page: /employees (The page to manage all company employees)

        Component: `<Sidebar />` - (Reused from dashboard).

        Component: `<TopNavbar />` - (Reused from dashboard).

        Component: `<EmployeeDataTable />` - A table listing all employees.

        Component: `<AddEmployeeModal />` - A popup form to add a new employee.

        Component: `<EditEmployeeModal />` - A popup form to edit employee details.

        Component: `<DeleteEmployeeDialog />` - A confirmation dialog before deleting an employee.

    Page: /assignments (The page to assign and track asset allocation)

        Component: `<Sidebar />` - (Reused from dashboard).

        Component: `<TopNavbar />` - (Reused from dashboard).

        Component: `<AssignmentTable />` - Displays all asset assignments with status.

        Component: `<AssignAssetModal />` - A form to assign an asset to an employee.

        Component: `<ReturnAssetModal />` - A modal to mark asset as returned.

        Component: `<FilterBar />` - Filters assignments by employee, asset type, and status.

    Page: /reports (The page to view asset reports and history)

        Component: `<Sidebar />` - (Reused from dashboard).

        Component: `<TopNavbar />` - (Reused from dashboard).

        Component: `<ConditionReportTable />` - Displays asset condition and maintenance history.

        Component: `<GenerateReportButton />` - Button to download CSV or PDF reports.

Role: Standard Employee (Can only view assets assigned to them and report issues)

    Page: /login (Authentication page for employee access)

        Component: `<AuthLayout />` - (Reused).

        Component: `<AuthForm />` - Login form.

    Page: /my-dashboard (Their personal landing page after login)

        Component: `<TopNavbar />` - Shows logged-in employee profile and logout button.

        Component: `<MyAssetSummaryCard />` - A card showing total assets assigned.

        Component: `<RecentActivityFeed />` - Displays recent assignment or return history.

    Page: /my-assets (The page to view all assigned assets)

        Component: `<TopNavbar />` - (Reused).

        Component: `<MyAssetList />` - A grid or list view of assigned assets.

        Component: `<AssetCard />` - Individual asset display card with basic details.

        Component: `<ReportIssueButton />` - A button that opens an issue reporting form.

    Page: /report-issue (The page to submit an issue for an assigned asset)

        Component: `<TopNavbar />` - (Reused).

        Component: `<IssueForm />` - A form to submit asset issue description.

        Component: `<SubmitButton />` - A button to submit the issue ticket.
