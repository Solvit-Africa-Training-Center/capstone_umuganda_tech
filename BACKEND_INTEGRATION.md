# Backend Integration Guide for Leader Dashboard

## Required Backend Endpoints

### 1. Enhanced Dashboard Stats Endpoint
```python
# In your Django views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leader_dashboard_stats(request):
    """Enhanced dashboard stats for leaders"""
    if request.user.role.lower() != 'leader':
        return Response({'error': 'Only leaders can access this endpoint'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    # Get leader's projects
    leader_projects = Project.objects.filter(admin=request.user)
    
    # Calculate stats
    total_projects = leader_projects.count()
    active_projects = leader_projects.filter(
        status__in=['planned', 'ongoing']
    ).count()
    completed_projects = leader_projects.filter(status='completed').count()
    cancelled_projects = leader_projects.filter(status='cancelled').count()
    
    # Get volunteer counts
    total_volunteers = ProjectRegistration.objects.filter(
        project__in=leader_projects
    ).values('user').distinct().count()
    
    # Get certificates issued
    certificates_issued = Certificate.objects.filter(
        project__in=leader_projects
    ).count()
    
    # Get upcoming deadlines (next 30 days)
    from datetime import datetime, timedelta
    thirty_days_from_now = datetime.now() + timedelta(days=30)
    upcoming_deadlines = leader_projects.filter(
        datetime__gte=datetime.now(),
        datetime__lte=thirty_days_from_now
    ).count()
    
    # Calculate attendance rate
    total_attendances = Attendance.objects.filter(
        project__in=leader_projects
    ).count()
    total_registrations = ProjectRegistration.objects.filter(
        project__in=leader_projects
    ).count()
    attendance_rate = (total_attendances / total_registrations * 100) if total_registrations > 0 else 0
    
    # Get recent projects
    recent_projects = leader_projects.order_by('-created_at')[:5]
    recent_projects_data = ProjectSerializer(recent_projects, many=True).data
    
    # Get upcoming projects
    upcoming_projects = leader_projects.filter(
        datetime__gte=datetime.now(),
        datetime__lte=thirty_days_from_now
    ).order_by('datetime')[:5]
    upcoming_projects_data = ProjectSerializer(upcoming_projects, many=True).data
    
    # Get recent registrations
    recent_registrations = ProjectRegistration.objects.filter(
        project__in=leader_projects
    ).order_by('-registered_at')[:5]
    
    recent_registrations_data = []
    for reg in recent_registrations:
        recent_registrations_data.append({
            'user': UserSerializer(reg.user).data,
            'project': ProjectSerializer(reg.project).data,
            'registered_at': reg.registered_at
        })
    
    # Get attendance overview
    from django.utils import timezone
    today = timezone.now().date()
    today_checkins = Attendance.objects.filter(
        project__in=leader_projects,
        check_in_time__date=today
    ).count()
    
    week_start = today - timedelta(days=today.weekday())
    week_attendance = Attendance.objects.filter(
        project__in=leader_projects,
        check_in_time__date__gte=week_start
    ).count()
    
    return Response({
        'status': {
            'total_projects': total_projects,
            'active_projects': active_projects,
            'completed_projects': completed_projects,
            'cancelled_projects': cancelled_projects,
            'total_volunteers': total_volunteers,
            'certificates_issued': certificates_issued,
            'upcoming_deadlines': upcoming_deadlines,
            'attendance_rate': round(attendance_rate, 1)
        },
        'recent_projects': recent_projects_data,
        'upcoming_deadlines': upcoming_projects_data,
        'recent_registrations': recent_registrations_data,
        'attendance_overview': {
            'today_checkins': today_checkins,
            'week_attendance': week_attendance,
            'attendance_rate': round(attendance_rate, 1)
        }
    })
```

### 2. Add URL Pattern
```python
# In your urls.py
urlpatterns = [
    # ... existing patterns
    path('api/projects/leader-dashboard/', leader_dashboard_stats, name='leader_dashboard_stats'),
]
```

### 3. Update Frontend API Call
```typescript
// Update src/api/projects.ts
// Leader dashboard stats
getLeaderDashboardStats: async (): Promise<LeaderDashboardStats> => {
  const response = await apiClient.get('/api/projects/leader-dashboard/');
  return response.data;
},
```

## Required Database Models (if not existing)

### ProjectRegistration Model
```python
class ProjectRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'project']
```

### Certificate Model
```python
class Certificate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    issued_date = models.DateTimeField(auto_now_add=True)
    certificate_url = models.URLField(blank=True, null=True)
```

## Testing Checklist

### Backend Testing
- [ ] Test leader_dashboard_stats endpoint with Postman/curl
- [ ] Verify all calculations are correct
- [ ] Test with different user roles (should reject non-leaders)
- [ ] Test with edge cases (no projects, no volunteers, etc.)

### Frontend Testing
- [ ] Test dashboard loads with real data
- [ ] Verify all statistics display correctly
- [ ] Test loading states work properly
- [ ] Test error handling for API failures

## Performance Optimizations

### Backend Optimizations
```python
# Use select_related and prefetch_related for efficient queries
def leader_dashboard_stats(request):
    leader_projects = Project.objects.filter(admin=request.user).select_related('admin')
    
    # Use aggregation for better performance
    from django.db.models import Count, Q
    
    stats = leader_projects.aggregate(
        total_projects=Count('id'),
        active_projects=Count('id', filter=Q(status__in=['planned', 'ongoing'])),
        completed_projects=Count('id', filter=Q(status='completed')),
        cancelled_projects=Count('id', filter=Q(status='cancelled'))
    )
```

### Frontend Optimizations
```typescript
// Add caching and memoization
const [dashboardCache, setDashboardCache] = useState<{
  data: LeaderDashboardStats | null;
  timestamp: number;
}>({ data: null, timestamp: 0 });

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchLeaderData = async () => {
  const now = Date.now();
  if (dashboardCache.data && (now - dashboardCache.timestamp) < CACHE_DURATION) {
    setLeaderDashboardStats(dashboardCache.data);
    return;
  }
  
  // Fetch fresh data...
};
```