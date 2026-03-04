import { useState } from 'react';
import { Share2, Link as LinkIcon, AlertTriangle, ArrowRightLeft, Search, Filter, Watch, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const MOCK_MAPPINGS = [
    { id: 1, external: 'Weekly Standard 5-Day', internal: 'Weekly Standard (5 Days)', extId: 'gid://shopify/Product/123', status: 'Mapped', type: 'Product', alert: false },
    { id: 2, external: 'Monthly Premium Keto', internal: 'Keto Monthly (20 Days)', extId: 'gid://shopify/Product/124', status: 'Mapped', type: 'Product', alert: false },
    { id: 3, external: 'Trial Promo 3pc', internal: 'Unassigned', extId: 'gid://shopify/Product/125', status: 'Unmapped', type: 'Product', alert: true },
];

const MOCK_CUST_MAPPINGS = [
    { id: 1, external: 'john.smith@example.com (Shopify)', internal: 'John Smith #C-1042', extId: 'gid://shopify/Customer/444', status: 'Mapped', alert: false },
    { id: 2, external: 'guest_user_99@gmail.com (Shopify)', internal: 'Unassigned', extId: 'gid://shopify/Customer/445', status: 'Unmapped', alert: true },
];

export default function Connections() {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="h-full flex flex-col space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Sync & Connections</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage how external data (Shopify) maps to internal entities</p>
                </div>
                <Button className="bg-primary hover:bg-orange-700 text-white rounded-card">
                    <ArrowRightLeft className="w-4 h-4 mr-2" /> Force Sync Now
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-3 bg-gray-100 rounded-full"><Share2 className="w-5 h-5 text-gray-700" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sync Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="font-semibold text-text">Connected</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-3 bg-red-50 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Issues Found</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-text">4 Unmapped Items</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                    <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-3 bg-blue-50 rounded-full"><Clock className="w-5 h-5 text-blue-600" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Last Polled</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-semibold text-text">2 mins ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="products" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-2 bg-gray-100">
                    <TabsTrigger value="products">Map Products</TabsTrigger>
                    <TabsTrigger value="customers">Map Customers</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4 flex-1">
                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full">
                        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                            <div className="relative w-full max-w-xs">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search external variants..." className="pl-9 bg-gray-50 border-gray-200" />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="mapped">Mapped</SelectItem>
                                    <SelectItem value="unmapped">Unmapped</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden flex-1">
                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-borderLight">
                                <TableRow>
                                    <TableHead className="w-[40%]">External Source (Shopify Product Variant)</TableHead>
                                    <TableHead className="w-10 text-center"><LinkIcon className="w-4 h-4 mx-auto text-gray-400" /></TableHead>
                                    <TableHead className="w-[40%]">Internal Entity (TiffinStash Meal Plan)</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_MAPPINGS.map((map) => (
                                    <TableRow key={map.id} className={`hover:bg-gray-50 ${map.alert ? 'bg-red-50/20' : ''}`}>
                                        <TableCell>
                                            <p className="font-medium text-text flex items-center gap-2">
                                                {map.external}
                                                {map.alert && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                                            </p>
                                            <p className="text-xs text-gray-400">{map.extId}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ArrowRightLeft className={`w-4 h-4 mx-auto ${map.status === 'Mapped' ? 'text-green-500' : 'text-gray-300'}`} />
                                        </TableCell>
                                        <TableCell>
                                            {map.status === 'Mapped' ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">{map.internal}</Badge>
                                            ) : (
                                                <Select>
                                                    <SelectTrigger className="w-full text-sm border-orange-200">
                                                        <SelectValue placeholder="Select internal plan to map..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="mp1">Weekly Standard</SelectItem>
                                                        <SelectItem value="mp2">Keto Monthly</SelectItem>
                                                        <SelectItem value="mp3">Trial Box</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {map.status === 'Mapped' ? (
                                                <Button variant="ghost" size="sm" className="text-gray-500 text-xs hover:text-red-600">Unmap</Button>
                                            ) : (
                                                <Button size="sm" className="bg-primary text-white">Save Mapping</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="customers" className="space-y-4 flex-1">
                    <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden flex-1">
                        <Table>
                            <TableHeader className="bg-gray-50 border-b border-borderLight">
                                <TableRow>
                                    <TableHead className="w-[40%]">External Customer (Shopify)</TableHead>
                                    <TableHead className="w-10 text-center"><LinkIcon className="w-4 h-4 mx-auto text-gray-400" /></TableHead>
                                    <TableHead className="w-[40%]">Internal Profile</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_CUST_MAPPINGS.map((map) => (
                                    <TableRow key={map.id} className={`hover:bg-gray-50 ${map.alert ? 'bg-red-50/20' : ''}`}>
                                        <TableCell>
                                            <p className="font-medium text-text flex items-center gap-2">
                                                {map.external}
                                                {map.alert && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                                            </p>
                                            <p className="text-xs text-gray-400">{map.extId}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ArrowRightLeft className={`w-4 h-4 mx-auto ${map.status === 'Mapped' ? 'text-green-500' : 'text-gray-300'}`} />
                                        </TableCell>
                                        <TableCell>
                                            {map.status === 'Mapped' ? (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">{map.internal}</Badge>
                                            ) : (
                                                <Button size="sm" variant="outline" className="border-orange-200 text-primary hover:bg-orange-50 w-full justify-start">
                                                    Generate Internal Profile...
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {map.status === 'Mapped' ? (
                                                <Button variant="ghost" size="sm" className="text-gray-500 text-xs">View Profile</Button>
                                            ) : (
                                                <Button size="sm" className="bg-gray-200 text-gray-700 cursor-not-allowed hidden">None</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
