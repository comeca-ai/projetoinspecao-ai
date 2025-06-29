# UI Implementation Plan - Detailed Breakdown

## Phase 1: Authentication & Core Layout

### 1.1 Authentication Pages
**Files to create/modify:**
- `src/pages/auth/Login.tsx`
- `src/pages/auth/Register.tsx` 
- `src/pages/auth/ForgotPassword.tsx`
- `src/components/auth/AuthLayout.tsx`

**Components needed:**
- Login form with email/password
- Registration form with role selection
- Password recovery form
- Role-based redirect logic after login
- Form validation and error handling

**Key features:**
- Supabase Auth integration
- Role detection (admin, gestor, inspetor)
- Redirect to appropriate dashboard based on role
- Remember me functionality
- Loading states and error messages

### 1.2 Core Layout Components
**Files to create/modify:**
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/RoleBasedLayout.tsx`

**Components needed:**
- Role-based navigation menu
- User profile dropdown
- Notification system
- Breadcrumb navigation
- Responsive sidebar

## Phase 2: Inspetor Interface

### 2.1 Dashboard do Inspetor
**Files to create:**
- `src/pages/inspetor/Dashboard.tsx`
- `src/components/inspetor/InspectionCard.tsx`
- `src/components/inspetor/QuickActions.tsx`

**Components needed:**
- List of assigned inspections
- Quick stats (pending, in progress, completed)
- Recent activity feed
- Quick action buttons (new inspection, continue inspection)
- Search and filter functionality

**Key features:**
- Real-time updates of inspection status
- Drag-and-drop for reordering inspections
- Quick preview of inspection details
- Mobile-responsive design for field use

### 2.2 Tela de Execução de Inspeção
**Files to create:**
- `src/pages/inspetor/InspectionExecution.tsx`
- `src/components/inspetor/TestLibrary.tsx`
- `src/components/inspetor/TestPanel.tsx`
- `src/components/inspetor/ObservationModal.tsx`
- `src/components/inspetor/MediaCapture.tsx`

**Components needed:**
- **Left Sidebar**: Draggable test library
  - Categorized test list (Electrical, HVAC, Solar, etc.)
  - Search functionality
  - Test descriptions and requirements
- **Center Panel**: Active tests area
  - Drop zone for tests
  - Test execution interface
  - Progress indicators
  - Reorder functionality
- **Media Capture**: 
  - Camera integration for photos
  - Audio recording for voice notes
  - File upload for documents
- **Observation Modal**:
  - Rich text editor
  - Media attachment
  - Severity levels
  - Tagging system

**Key features:**
- Drag-and-drop from test library to active tests
- Real-time auto-save
- Offline capability for field work
- Touch-friendly interface for tablets
- Progress tracking and completion status

### 2.3 Modal do Assistente Virtual
**Files to create:**
- `src/components/inspetor/VoiceAssistant.tsx`
- `src/components/inspetor/VoiceTranscription.tsx`
- `src/components/inspetor/CommandHistory.tsx`
- `src/hooks/useVoiceAssistant.ts`

**Components needed:**
- **Voice Input Interface**:
  - Push-to-talk button
  - Voice level indicator
  - Recording status
- **Transcription Display**:
  - Real-time transcription
  - Confidence indicators
  - Edit capability
- **Command Feedback**:
  - Action interpretation display
  - Execution confirmation
  - Error handling and suggestions
- **Command History**:
  - Last 10 commands
  - Success/failure indicators
  - Replay functionality

**Key features:**
- WebRTC audio capture
- Real-time transcription feedback
- Visual confirmation of executed actions
- Fallback to manual input
- Command suggestions and help

### 2.4 Geração e Visualização de Relatórios
**Files to create:**
- `src/pages/inspetor/ReportGeneration.tsx`
- `src/components/inspetor/ReportPreview.tsx`
- `src/components/inspetor/ReportTemplate.tsx`

**Components needed:**
- Report configuration interface
- Template selection
- Data review and editing
- PDF preview
- Export options

**Key features:**
- Multiple report formats
- Custom branding options
- Digital signatures
- Email integration
- Print optimization

## Phase 3: Gestor Interface

### 3.1 Painel de Equipe
**Files to create:**
- `src/pages/gestor/TeamDashboard.tsx`
- `src/components/gestor/TeamMemberCard.tsx`
- `src/components/gestor/InviteMemberModal.tsx`
- `src/components/gestor/TeamStats.tsx`

**Components needed:**
- Team member list with roles
- Performance metrics per inspector
- Active inspections overview
- Team workload distribution
- Member invitation system

**Key features:**
- Real-time team activity
- Performance analytics
- Workload balancing tools
- Role management
- Communication tools

### 3.2 Gerenciador de Templates
**Files to create:**
- `src/pages/gestor/TemplateManager.tsx`
- `src/components/gestor/TemplateEditor.tsx`
- `src/components/gestor/TemplateLibrary.tsx`

**Components needed:**
- Template creation wizard
- Drag-and-drop template builder
- Test library integration
- Template versioning
- Sharing and permissions

**Key features:**
- Visual template builder
- Test sequence configuration
- Custom field definitions
- Template validation
- Import/export functionality

### 3.3 Dashboard Analítico
**Files to create:**
- `src/pages/gestor/Analytics.tsx`
- `src/components/gestor/PerformanceCharts.tsx`
- `src/components/gestor/ProjectMetrics.tsx`

**Components needed:**
- Performance dashboards
- Trend analysis
- Resource utilization
- Quality metrics
- Export capabilities

**Key features:**
- Interactive charts and graphs
- Customizable date ranges
- Drill-down capabilities
- Automated reporting
- Data export options

### 3.4 Planos e Cobrança
**Files to create:**
- `src/pages/gestor/Billing.tsx`
- `src/components/gestor/PlanComparison.tsx`
- `src/components/gestor/UsageMetrics.tsx`

**Components needed:**
- Current plan display
- Usage monitoring
- Upgrade/downgrade options
- Billing history
- Payment methods

## Phase 4: Admin SaaS Interface

### 4.1 Painel de Contas e Planos
**Files to create:**
- `src/pages/admin/ClientManagement.tsx`
- `src/components/admin/ClientCard.tsx`
- `src/components/admin/PlanManagement.tsx`

**Components needed:**
- Client account overview
- Plan management tools
- Usage monitoring
- Support tools
- Billing integration

### 4.2 Visão Global de Uso
**Files to create:**
- `src/pages/admin/SystemOverview.tsx`
- `src/components/admin/SystemMetrics.tsx`
- `src/components/admin/ResourceMonitoring.tsx`

**Components needed:**
- System-wide metrics
- Resource utilization
- Performance monitoring
- Capacity planning
- Alert system

### 4.3 Log de Comandos de Voz
**Files to create:**
- `src/pages/admin/VoiceLogs.tsx`
- `src/components/admin/CommandAnalytics.tsx`
- `src/components/admin/ErrorTracking.tsx`

**Components needed:**
- Command log viewer
- Error analysis tools
- Performance metrics
- User behavior analytics
- Debug tools

## Phase 5: Shared Components & Utilities

### 5.1 Shared UI Components
**Files to create:**
- `src/components/shared/DataTable.tsx`
- `src/components/shared/FileUpload.tsx`
- `src/components/shared/SearchFilter.tsx`
- `src/components/shared/StatusBadge.tsx`
- `src/components/shared/ConfirmDialog.tsx`

### 5.2 Hooks and Utilities
**Files to create:**
- `src/hooks/useAuth.ts`
- `src/hooks/usePermissions.ts`
- `src/hooks/useRealtime.ts`
- `src/utils/rolePermissions.ts`
- `src/utils/planLimits.ts`

### 5.3 Context Providers
**Files to create:**
- `src/contexts/AuthContext.tsx`
- `src/contexts/PermissionsContext.tsx`
- `src/contexts/VoiceAssistantContext.tsx`

## Implementation Priority

### Sprint 1 (Week 1-2): Foundation
1. Authentication pages and layout
2. Role-based routing
3. Basic dashboard structure

### Sprint 2 (Week 3-4): Inspetor Core
1. Inspection execution interface
2. Test library and drag-and-drop
3. Basic observation capture

### Sprint 3 (Week 5-6): Voice Assistant
1. Voice assistant modal
2. Audio capture and transcription
3. Command execution feedback

### Sprint 4 (Week 7-8): Gestor Interface
1. Team management
2. Template manager
3. Analytics dashboard

### Sprint 5 (Week 9-10): Admin & Polish
1. Admin interface
2. System monitoring
3. Final polish and testing

## Technical Considerations

### State Management
- Use React Context for global state
- Local state for component-specific data
- Real-time updates via Supabase subscriptions

### Performance
- Lazy loading for large components
- Virtual scrolling for large lists
- Image optimization and caching
- Progressive loading for mobile

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode

### Mobile Optimization
- Touch-friendly interfaces
- Responsive design
- Offline capabilities
- PWA features for field use

### Security
- Role-based component rendering
- API permission checks
- Secure file uploads
- XSS protection

This implementation plan provides a structured approach to building the complete UI system with clear phases, priorities, and technical considerations.