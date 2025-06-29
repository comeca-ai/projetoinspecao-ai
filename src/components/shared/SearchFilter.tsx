import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Calendar,
  SlidersHorizontal
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterValue {
  [key: string]: any;
}

export interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterOption[];
  filterValues?: FilterValue;
  onFilterChange?: (filters: FilterValue) => void;
  onClearFilters?: () => void;
  showFilterCount?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  showFilterCount = true,
  className = "",
  size = "default"
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    onSearchChange?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    onFilterChange?.(newFilters);
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filterValues };
    delete newFilters[key];
    onFilterChange?.(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filterValues).filter(key => {
      const value = filterValues[key];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
  };

  const getFilterDisplayValue = (filter: FilterOption, value: any) => {
    if (!value) return null;

    switch (filter.type) {
      case 'select':
        const option = filter.options?.find(opt => opt.value === value);
        return option?.label || value;
      
      case 'multiselect':
        if (Array.isArray(value) && value.length > 0) {
          return `${value.length} selecionado${value.length > 1 ? 's' : ''}`;
        }
        return null;
      
      case 'date':
        return value instanceof Date ? value.toLocaleDateString('pt-BR') : value;
      
      case 'daterange':
        if (value?.from && value?.to) {
          return `${value.from.toLocaleDateString('pt-BR')} - ${value.to.toLocaleDateString('pt-BR')}`;
        }
        return null;
      
      default:
        return value;
    }
  };

  const activeFilterCount = getActiveFilterCount();

  const inputSizeClass = {
    sm: "h-8",
    default: "h-10",
    lg: "h-12"
  }[size];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search and Filter Row */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={localSearchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn("pl-10", inputSizeClass)}
          />
          {localSearchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("relative", inputSizeClass)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && showFilterCount && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filtros</h4>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onClearFilters?.();
                        setIsFilterOpen(false);
                      }}
                    >
                      Limpar tudo
                    </Button>
                  )}
                </div>

                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-sm font-medium">{filter.label}</label>
                    
                    {filter.type === 'select' && (
                      <Select
                        value={filterValues[filter.key] || ""}
                        onValueChange={(value) => handleFilterChange(filter.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={filter.placeholder || "Selecione..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === 'text' && (
                      <Input
                        placeholder={filter.placeholder}
                        value={filterValues[filter.key] || ""}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      />
                    )}

                    {filter.type === 'date' && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <Calendar className="mr-2 h-4 w-4" />
                            {filterValues[filter.key] 
                              ? filterValues[filter.key].toLocaleDateString('pt-BR')
                              : filter.placeholder || "Selecionar data"
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={filterValues[filter.key]}
                            onSelect={(date) => handleFilterChange(filter.key, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterValues).map(([key, value]) => {
            const filter = filters.find(f => f.key === key);
            if (!filter || !value) return null;

            const displayValue = getFilterDisplayValue(filter, value);
            if (!displayValue) return null;

            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {filter.label}: {displayValue}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};