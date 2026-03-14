import React, { useState, useMemo, useEffect } from 'react';
import { Utensils, Tag, Plus, Filter, Edit, Trash2, MoreHorizontal, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { API_BASE_URL } from '../config';

type MealPlan = {
    id: string;
    sku: string;
    name: string;
    variant: string;
    type: string;
    is_lunch: boolean;
    is_dinner: boolean;
    areas: string[];
    price: number;
    tags: string[];
    vendor: string;
    inventory: number | null;
    status: string;
};

export default function MealPlans() {
    const [activeTab, setActiveTab] = useState('plans');
    const [searchTerm, setSearchTerm] = useState('');
    const [cuisineFilter, setCuisineFilter] = useState('all');
    const [areaFilter, setAreaFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: plans, isLoading, refetch, isFetching } = useQuery<MealPlan[]>({
        queryKey: ['mealPlans'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/meal-plans`);
            if (!res.ok) throw new Error('Failed to fetch meal plans');
            return res.json();
        }
    });

    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

    const { cuisines, areas } = useMemo(() => {
        if (!plans) return { cuisines: [], areas: [] };
        const cSet = new Set<string>();
        const aSet = new Set<string>();
        plans.forEach(p => {
            if (p.type) cSet.add(p.type);
            p.areas.forEach(a => aSet.add(a));
        });
        return {
            cuisines: Array.from(cSet).sort(),
            areas: Array.from(aSet).sort()
        };
    }, [plans]);

    const filteredPlans = useMemo(() => {
        if (!plans) return [];
        return plans.filter(plan => {
            const matchesSearch =
                (plan.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (plan.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (plan.variant?.toLowerCase() || "").includes(searchTerm.toLowerCase());

            const matchesCuisine = cuisineFilter === 'all' || plan.type === cuisineFilter;
            const matchesArea = areaFilter === 'all' || plan.areas.includes(areaFilter);
            const matchesStatus = statusFilter === 'all' || plan.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesCuisine && matchesArea && matchesStatus;
        });
    }, [plans, searchTerm, cuisineFilter, areaFilter, statusFilter]);

    const groupedPlans = useMemo(() => {
        const groups: Record<string, MealPlan[]> = {};
        filteredPlans.forEach(plan => {
            const key = (plan.vendor || 'Unknown Vendor').trim();
            if (!groups[key]) groups[key] = [];
            groups[key].push(plan);
        });
        return Object.entries(groups).map(([vendor, plans]) => ({
            name: vendor,
            variants: plans
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredPlans]);

    // Auto-expand groups only when a search or filter is active; otherwise stay collapsed
    useEffect(() => {
        const hasActiveFilter = searchTerm || cuisineFilter !== 'all' || areaFilter !== 'all' || statusFilter !== 'all';
        if (hasActiveFilter && groupedPlans.length > 0) {
            setExpandedProducts(new Set(groupedPlans.map(g => g.name)));
        } else if (!hasActiveFilter) {
            setExpandedProducts(new Set());
        }
    }, [groupedPlans, searchTerm, cuisineFilter, areaFilter, statusFilter]);

    const toggleProduct = (name: string) => {
        const next = new Set(expandedProducts);
        if (next.has(name)) {
            next.delete(name);
        } else {
            next.add(name);
        }
        setExpandedProducts(next);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Menu & Plans</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage meal packages synced directly from Shopify</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-card border-gray-200"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                        Sync Shopify
                    </Button>
                    <Button className="bg-primary hover:bg-orange-700 text-white rounded-card">
                        <Plus className="w-4 h-4 mr-2" /> Add New {activeTab === 'plans' ? 'Plan' : activeTab === 'items' ? 'Item' : 'Tag'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="plans" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-2 bg-gray-100 rounded-md p-1">
                    <TabsTrigger value="plans" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Meal Plans</TabsTrigger>
                    <TabsTrigger value="items" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Meal Items</TabsTrigger>
                    <TabsTrigger value="tags" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Tags</TabsTrigger>
                </TabsList>

                <TabsContent value="plans" className="space-y-4 flex-1">
                    <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                            <div className="relative w-full">
                                <Utensils className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search name or SKU..."
                                    className="pl-9 bg-white border-gray-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="Cuisine (Type)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cuisines</SelectItem>
                                    {cuisines.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={areaFilter} onValueChange={setAreaFilter}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="Area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Areas</SelectItem>
                                    {areas.map(a => (
                                        <SelectItem key={a} value={a}>{a}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="bg-white border-gray-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white border-b border-borderLight">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-gray-600">Plan / SKU</TableHead>
                                    <TableHead className="font-semibold text-gray-600">Type / Shift</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-600">Price (CAD)</TableHead>
                                    <TableHead className="font-semibold text-gray-600">Areas Delivered</TableHead>
                                    <TableHead className="font-semibold text-gray-600">Status</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                            Fetching plans from Shopify...
                                        </TableCell>
                                    </TableRow>
                                ) : groupedPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                            No meal plans found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    groupedPlans.map(({ name, variants }) => {
                                        const isExpanded = expandedProducts.has(name);
                                        return (
                                            <React.Fragment key={name}>
                                                {/* Product Header Row */}
                                                <TableRow
                                                    className="bg-gray-50/50 cursor-pointer hover:bg-gray-100/80 transition-colors border-l-4 border-l-primary/10"
                                                    onClick={() => toggleProduct(name)}
                                                >
                                                    <TableCell colSpan={6} className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            {isExpanded ? (
                                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                                            ) : (
                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className="font-bold text-text text-base">{name}</span>
                                                            <Badge variant="outline" className="ml-2 bg-white text-[10px] text-gray-400 border-gray-200">
                                                                {variants.length} {variants.length === 1 ? 'plan' : 'plans'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Plan Rows under each Vendor */}
                                                {isExpanded && variants.map((plan) => (
                                                    <TableRow key={plan.id} className="hover:bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <TableCell className="pl-10">
                                                            <div className="font-medium text-gray-700">{plan.name}</div>
                                                            <div className="text-sm text-gray-500 mt-0.5">{plan.variant}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{plan.sku || 'NO-SKU'}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-gray-600">{plan.type}</div>
                                                            <div className="flex gap-1 mt-1">
                                                                {plan.is_lunch && <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50 text-[10px] h-4">Lunch</Badge>}
                                                                {plan.is_dinner && <Badge className="bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-50 text-[10px] h-4">Dinner</Badge>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-text">${plan.price.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                                {plan.areas.map((area, i) => (
                                                                    <Badge key={i} variant="outline" className="text-[10px] font-normal text-gray-500 bg-gray-50">
                                                                        {area}
                                                                    </Badge>
                                                                ))}
                                                                {plan.areas.length === 0 && <span className="text-xs text-gray-400 italic">Global</span>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className={`border-0 capitalize ${plan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {plan.status.toLowerCase()}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem className="cursor-pointer">View in Shopify</DropdownMenuItem>
                                                                    <DropdownMenuItem className="cursor-pointer text-red-600">Archive Variant</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                    <div className="bg-white p-6 rounded-card shadow-sm border border-borderLight flex flex-col items-center justify-center h-[300px]">
                        <Utensils className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Meal Items</h3>
                        <p className="text-gray-500 mb-4 text-center max-w-sm">Individual food items and components that make up the meal plans. Sync from master list coming soon.</p>
                        <Button variant="outline">Browse Master List</Button>
                    </div>
                </TabsContent>

                <TabsContent value="tags">
                    <div className="bg-white p-6 rounded-card shadow-sm border border-borderLight flex flex-col items-center justify-center h-[300px]">
                        <Tag className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Tag Management</h3>
                        <p className="text-gray-500 mb-4">Create global tags to categorize meal plans, items, and customers.</p>
                        <Button variant="outline">Manage Tags</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
