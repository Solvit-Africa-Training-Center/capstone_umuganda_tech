# Performance Optimizations for Leader Dashboard

## Frontend Optimizations

### 1. Data Caching and Memoization

```typescript
// src/hooks/useLeaderDashboard.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { projectsAPI } from '../api/projects';
import type { LeaderDashboardStats } from '../types/api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const dashboardCache = new Map<string, CacheEntry<any>>();

export const useLeaderDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<LeaderDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback(<T>(key: string): T | null => {
    const cached = dashboardCache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    dashboardCache.delete(key);
    return null;
  }, []);

  const setCachedData = useCallback(<T>(key: string, data: T) => {
    dashboardCache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_DURATION
    });
  }, []);

  const fetchDashboardStats = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'leader-dashboard-stats';
    
    if (!forceRefresh) {
      const cached = getCachedData<LeaderDashboardStats>(cacheKey);
      if (cached) {
        setDashboardStats(cached);
        setIsLoading(false);
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const [stats, projects] = await Promise.all([
        projectsAPI.getLeaderDashboardStats(),
        projectsAPI.getMyProjects()
      ]);
      
      const enhancedStats = {
        ...stats,
        recent_projects: projects.slice(0, 5)
      };
      
      setCachedData(cacheKey, enhancedStats);
      setDashboardStats(enhancedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [getCachedData, setCachedData]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const memoizedStats = useMemo(() => dashboardStats, [dashboardStats]);

  return {
    dashboardStats: memoizedStats,
    isLoading,
    error,
    refetch: () => fetchDashboardStats(true)
  };
};
```

### 2. Component Optimization with React.memo

```typescript
// src/components/LeaderDashboard/DashboardStats.tsx
import React, { memo } from 'react';

const DashboardStats: React.FC<DashboardStatsProps> = memo(({ stats, isLoading }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.isLoading === nextProps.isLoading &&
    JSON.stringify(prevProps.stats) === JSON.stringify(nextProps.stats)
  );
});

export default DashboardStats;
```

### 3. Lazy Loading for Large Lists

```typescript
// src/components/VirtualizedProjectList.tsx
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedProjectListProps {
  projects: Project[];
  height: number;
  itemHeight: number;
}

const VirtualizedProjectList: React.FC<VirtualizedProjectListProps> = ({
  projects,
  height,
  itemHeight
}) => {
  const ProjectItem = useMemo(() => 
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const project = projects[index];
      return (
        <div style={style} className="p-4 border-b border-gray-200">
          <h3 className="font-medium">{project.title}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
      );
    }, [projects]
  );

  return (
    <List
      height={height}
      itemCount={projects.length}
      itemSize={itemHeight}
      itemData={projects}
    >
      {ProjectItem}
    </List>
  );
};
```

### 4. Debounced Search

```typescript
// src/hooks/useDebounce.ts (already exists, enhance if needed)
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage in search components
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
    }
  }, [debouncedSearchTerm]);
};
```

### 5. Image Optimization

```typescript
// src/components/OptimizedImage.tsx
import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  placeholder = '/placeholder.jpg'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setImageSrc(placeholder);
    setIsLoading(false);
  }, [placeholder]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = handleError;
    img.src = src;
  }, [src, handleError]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
```

## Backend Optimizations

### 1. Database Query Optimization

```python
# Optimized Django views
from django.db.models import Prefetch, Count, Q, F
from django.core.cache import cache

@api_view(['GET'])
def optimized_leader_dashboard(request):
    cache_key = f'leader_dashboard_{request.user.id}'
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return Response(cached_data)
    
    # Optimized queries with select_related and prefetch_related
    leader_projects = Project.objects.filter(admin=request.user).select_related(
        'admin'
    ).prefetch_related(
        Prefetch(
            'registrations',
            queryset=ProjectRegistration.objects.select_related('user')
        ),
        Prefetch(
            'attendances',
            queryset=Attendance.objects.select_related('user')
        )
    )
    
    # Use aggregation for better performance
    stats = leader_projects.aggregate(
        total_projects=Count('id'),
        active_projects=Count('id', filter=Q(status__in=['planned', 'ongoing'])),
        completed_projects=Count('id', filter=Q(status='completed')),
        total_volunteers=Count('registrations__user', distinct=True)
    )
    
    # Cache the result for 5 minutes
    cache.set(cache_key, stats, 300)
    
    return Response(stats)
```

### 2. API Response Pagination

```python
# Custom pagination for large datasets
from rest_framework.pagination import PageNumberPagination

class OptimizedPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
            'page_info': {
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'page_size': self.page_size
            }
        })
```

### 3. Background Tasks for Heavy Operations

```python
# Using Celery for background tasks
from celery import shared_task

@shared_task
def generate_dashboard_report(user_id):
    """Generate comprehensive dashboard report in background"""
    user = User.objects.get(id=user_id)
    # Heavy computation here
    return report_data

# In views
@api_view(['POST'])
def request_dashboard_report(request):
    task = generate_dashboard_report.delay(request.user.id)
    return Response({'task_id': task.id})
```

## Bundle Optimization

### 1. Code Splitting

```typescript
// src/App.tsx - Lazy load components
import { lazy, Suspense } from 'react';

const LeaderDashboard = lazy(() => import('./components/LeaderDashboard'));
const CreateProject = lazy(() => import('./components/CreateProject'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/leader-dashboard" element={<LeaderDashboard />} />
      <Route path="/create-project" element={<CreateProject />} />
    </Routes>
  </Suspense>
);
```

### 2. Vite Bundle Analysis

```bash
# Add to package.json
{
  "scripts": {
    "analyze": "vite build --mode analyze",
    "build:analyze": "npm run build && npx vite-bundle-analyzer dist"
  }
}
```

## Monitoring and Metrics

```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Usage
measurePerformance('Dashboard Load', () => {
  // Dashboard loading logic
});
```