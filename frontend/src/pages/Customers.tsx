import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import { Button } from '../components/ui/button';

import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

// Type representing the shape returned by the API
type CustomerData = {
    id: string; // the database uses string UUIDs
    name: string;
    email: string;
    phone: string | null;
    packages: number;
    mealsRemaining: number;
    revenue: number;
    status: string;
};

export default function Customers() {
    const { data: customersData = [], isLoading } = useQuery<CustomerData[]>({
        queryKey: ['customersData'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/customers`);

            if (!res.ok) throw new Error('Failed to fetch customers');
            return res.json();
        }
    });

    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const toggleRow = (id: string) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setSelectedRows(selectedRows.length === customersData.length ? [] : customersData.map(c => c.id));
    };

    const handleRowClick = (customer: CustomerData) => {
        setSelectedCustomer(customer);
        setIsDrawerOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'Expired': return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'On Hold': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
            case 'New': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Customers</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage all customer accounts and subscriptions</p>
                </div>
                <Button className="bg-primary hover:bg-orange-700 text-white rounded-card">
                    <Plus className="w-4 h-4 mr-2" /> Add Customer
                </Button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Search name, email, phone..." className="pl-9 bg-white border-gray-200 focus:ring-primary" />
                    </div>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[140px] bg-white border-gray-200 focus:ring-primary">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="linked">Linked Only</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 border border-gray-200 bg-gray-50 px-3 py-2 rounded-md cursor-not-allowed">
                        <Filter className="w-4 h-4" />
                        <span>Date Range Please</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Per page:</span>
                    <Select defaultValue="10">
                        <SelectTrigger className="w-[70px] bg-white border-gray-200 focus:ring-primary">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <Button variant="outline" className="border-gray-200 text-gray-700" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Bulk Actions Context (Visible only when items selected) */}
            {selectedRows.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 flex justify-between items-center rounded-md text-sm">
                    <span>{selectedRows.length} customers selected. Please choose an action:</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50">Bulk Pause</Button>
                        <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50">Cancel Subscriptions</Button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden flex-1">
                <Table>
                    <TableHeader className="bg-white border-b border-borderLight sticky top-0">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedRows.length === customersData.length && customersData.length > 0}
                                    onCheckedChange={toggleAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead className="font-semibold text-gray-600">Customer</TableHead>
                            <TableHead className="font-semibold text-gray-600">Email</TableHead>
                            <TableHead className="font-semibold text-gray-600">Phone</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">Packages</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">Meals Remaining</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600">Revenue (CAD)</TableHead>
                            <TableHead className="font-semibold text-gray-600">Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-48 text-center text-gray-500">
                                    Loading customers...
                                </TableCell>
                            </TableRow>
                        ) : customersData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-48 text-center text-gray-500">
                                    No customers found. Please adjust your filters or add a new customer.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customersData.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => handleRowClick(customer)}
                                >
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedRows.includes(customer.id)}
                                            onCheckedChange={() => toggleRow(customer.id)}
                                            aria-label={`Select ${customer.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-text">{customer.name}</TableCell>
                                    <TableCell className="text-gray-600">{customer.email}</TableCell>
                                    <TableCell className="text-gray-600">{customer.phone}</TableCell>
                                    <TableCell className="text-right text-gray-800">{customer.packages}</TableCell>
                                    <TableCell className="text-right text-gray-800">{customer.mealsRemaining}</TableCell>
                                    <TableCell className="text-right text-gray-800">${customer.revenue.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`${getStatusColor(customer.status)} border-0 font-medium`}>
                                            {customer.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleRowClick(customer)}>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Add Package</DropdownMenuItem>
                                                <DropdownMenuItem>Message Customer</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Customer Detail Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] sm:max-w-md p-0 overflow-y-auto bg-white">
                    {selectedCustomer && (
                        <div className="flex flex-col h-full">
                            {/* Drawer Header */}
                            <div className="bg-gray-50 border-b border-borderLight p-6">
                                <SheetHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <SheetTitle className="text-2xl font-bold text-text">
                                                {selectedCustomer.name}
                                            </SheetTitle>
                                            <SheetDescription className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className={`${getStatusColor(selectedCustomer.status)} border-0 mt-1`}>
                                                    {selectedCustomer.status}
                                                </Badge>
                                                <span className="text-gray-500">• Customer since 2023</span>
                                            </SheetDescription>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-4 space-y-1">
                                        <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                        <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                                        <p><strong>Address:</strong> 123 Maple St, Unit 4B, Toronto, ON</p>
                                    </div>
                                </SheetHeader>
                            </div>

                            {/* Drawer Content Tabs */}
                            <div className="p-6 flex-1">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-md">
                                        <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                                        <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Subscriptions</TabsTrigger>
                                        <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-card border border-borderLight text-center">
                                                <p className="text-sm text-gray-500 mb-1">Total Packages</p>
                                                <p className="text-2xl font-bold text-text">{selectedCustomer.packages}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-card border border-borderLight text-center">
                                                <p className="text-sm text-gray-500 mb-1">Active Packages</p>
                                                <p className="text-2xl font-bold text-text">{selectedCustomer.status === 'Active' ? 1 : 0}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-card border border-borderLight text-center">
                                                <p className="text-sm text-gray-500 mb-1">Meals Remaining</p>
                                                <p className="text-2xl font-bold text-text">{selectedCustomer.mealsRemaining}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-card border border-borderLight text-center">
                                                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                                <p className="text-2xl font-bold text-text">${selectedCustomer.revenue.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 border border-orange-200 rounded-card p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-orange-900">Add a new package for this customer?</p>
                                                <p className="text-xs text-orange-700 mt-1">Quick start a new subscription from here.</p>
                                            </div>
                                            <Button size="sm" className="bg-primary hover:bg-orange-700 text-white rounded-md">Add Package</Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="subscriptions" className="space-y-4">
                                        <div className="border border-borderLight rounded-card p-4 bg-white shadow-sm">
                                            <div className="flex justify-between items-start mb-3 border-b border-borderLight pb-3">
                                                <div>
                                                    <h4 className="font-semibold text-text">Standard Monthly Plan</h4>
                                                    <p className="text-sm text-gray-500">Store A • Weekdays (Mon-Fri)</p>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">Active</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                                                <div><span className="text-gray-500">Start Date:</span> Nov 1, 2023</div>
                                                <div><span className="text-gray-500">Est. End:</span> Nov 28, 2023</div>
                                                <div><span className="text-gray-500">Meals Left:</span> 12/20</div>
                                                <div><span className="text-gray-500">Payment:</span> <span className="text-green-600 font-medium whitespace-nowrap">Paid (Stripe)</span></div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                                <Button size="sm" variant="outline" className="text-xs">Pause</Button>
                                                <Button size="sm" variant="outline" className="text-xs">Renew</Button>
                                                <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">Cancel</Button>
                                                <Button size="sm" variant="ghost" className="text-xs text-primary hover:bg-orange-50 hover:text-orange-700">Add-ons Please</Button>
                                            </div>
                                        </div>
                                        {/* Add more subscription placeholder cards here if they had multiple */}
                                    </TabsContent>

                                    <TabsContent value="history">
                                        <div className="relative border-l border-gray-200 ml-3 pl-4 space-y-6 mt-4">
                                            <div className="relative">
                                                <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[21px] top-1.5 border border-white"></div>
                                                <p className="text-sm text-gray-500">Nov 12, 2023 - 2:45 PM</p>
                                                <p className="text-sm font-medium text-text mt-1">Admin applied skip for tomorrow</p>
                                                <p className="text-xs text-gray-500">Reason: Customer going out of town.</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[21px] top-1.5 border border-white"></div>
                                                <p className="text-sm text-gray-500">Nov 1, 2023 - 9:00 AM</p>
                                                <p className="text-sm font-medium text-text mt-1">Stripe Payment Successful ($350.00)</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[21px] top-1.5 border border-white"></div>
                                                <p className="text-sm text-gray-500">Oct 30, 2023 - 10:15 AM</p>
                                                <p className="text-sm font-medium text-text mt-1">System imported order from Shopify</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">Order #40921 created Draft Subscription. <Button variant="link" className="p-0 h-auto text-primary text-xs">View Order</Button></p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
