import { useState } from 'react';
import { Utensils, Tag, Plus, Filter, Edit, Trash2, MoreHorizontal, RefreshCw } from 'lucide-react';
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

    const { data: plans, isLoading, refetch, isFetching } = useQuery<MealPlan[]>({
        queryKey: ['mealPlans'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/meal-plans`);
            if (!res.ok) throw new Error('Failed to fetch meal plans');
            return res.json();
        }
    });

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
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full">
                        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                            <div className="relative w-full max-w-xs">
                                <Utensils className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search plans..." className="pl-9 bg-white border-gray-200" />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px] bg-white border-gray-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
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
                                ) : plans?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                            No meal plans found in Shopify.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    plans?.map((plan) => (
                                        <TableRow key={plan.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-text">{plan.name}</div>
                                                <div className="text-xs text-gray-400">{plan.sku || 'No SKU'} • {plan.variant}</div>
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
                                                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="cursor-pointer">View in Shopify</DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">Edit Metadata</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
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
