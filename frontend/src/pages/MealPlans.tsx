import { useState } from 'react';
import { Utensils, Tag, Plus, Filter, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

// Mock Data
const MOCK_PLANS = [
    { id: 'MP-01', name: 'Weekly Standard (5 Days)', store: 'Store A', price: 65.00, status: 'Active', tags: ['Popular', 'Vegetarian Option'] },
    { id: 'MP-02', name: 'Monthly Premium (20 Days)', store: 'Store A', price: 240.00, status: 'Active', tags: ['High Protein'] },
    { id: 'MP-03', name: 'Weekly Standard (5 Days)', store: 'Store B', price: 70.00, status: 'Draft', tags: ['Popular'] },
    { id: 'MP-04', name: 'Trial Box (2 Days)', store: 'All Stores', price: 30.00, status: 'Active', tags: ['New Customer'] },
];

const MOCK_ITEMS = [
    { id: 'MI-101', name: 'Butter Chicken & Naan', category: 'Main Course', cost: 4.50, status: 'Active' },
    { id: 'MI-102', name: 'Palak Paneer', category: 'Main Course', cost: 3.80, status: 'Active' },
    { id: 'MI-103', name: 'Gulab Jamun (2pcs)', category: 'Dessert', cost: 1.20, status: 'Active' },
    { id: 'MI-104', name: 'Mango Lassi', category: 'Beverage', cost: 1.50, status: 'Draft' },
];

export default function MealPlans() {
    const [activeTab, setActiveTab] = useState('plans');

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Menu & Plans</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage meal packages, individual food items, and tags</p>
                </div>
                <Button className="bg-primary hover:bg-orange-700 text-white rounded-card">
                    <Plus className="w-4 h-4 mr-2" /> Add New {activeTab === 'plans' ? 'Plan' : activeTab === 'items' ? 'Item' : 'Tag'}
                </Button>
            </div>

            <Tabs defaultValue="plans" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-2 bg-gray-100">
                    <TabsTrigger value="plans">Meal Plans</TabsTrigger>
                    <TabsTrigger value="items">Meal Items</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>

                <TabsContent value="plans" className="space-y-4 flex-1">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full">
                        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                            <div className="relative w-full max-w-xs">
                                <Utensils className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search meal plans..." className="pl-9 bg-gray-50 border-gray-200" />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Store" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stores</SelectItem>
                                    <SelectItem value="store_a">Store A</SelectItem>
                                    <SelectItem value="store_b">Store B</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="active">
                                <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-borderLight">
                                <TableRow>
                                    <TableHead>Plan Name</TableHead>
                                    <TableHead>Store Availability</TableHead>
                                    <TableHead className="text-right">Price (CAD)</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_PLANS.map((plan) => (
                                    <TableRow key={plan.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-text">{plan.name}</TableCell>
                                        <TableCell className="text-gray-600">{plan.store}</TableCell>
                                        <TableCell className="text-right font-medium">${plan.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {plan.tags.map((tag, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`border-0 ${plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {plan.status}
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
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Edit className="w-4 h-4 mr-2" /> Edit Plan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                    {/* Similar Filter Bar for mapping through items */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full">
                        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                            <div className="relative w-full max-w-xs">
                                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search meal items..." className="pl-9 bg-gray-50 border-gray-200" />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="main">Main Course</SelectItem>
                                    <SelectItem value="dessert">Dessert</SelectItem>
                                    <SelectItem value="beverage">Beverage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-borderLight">
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Internal Cost (CAD)</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_ITEMS.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-text">{item.name}</TableCell>
                                        <TableCell className="text-gray-600">{item.category}</TableCell>
                                        <TableCell className="text-right font-medium text-gray-500">${item.cost.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`border-0 ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-primary">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
