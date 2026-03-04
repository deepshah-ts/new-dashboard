import { useState } from 'react';
import { Truck, MapPin, Users, Navigation, Calendar as CalendarIcon, PackageOpen, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Mock Data
const MOCK_DELIVERIES_TODAY = [
    { id: 'DEL-101', customer: 'Alice Smith', address: '123 Maple St, Unit 4B', postal: 'M5V 2H1', status: 'Planned', zone: 'Downtown Core', meals: 2 },
    { id: 'DEL-102', customer: 'Bob Johnson', address: '456 Oak Ave', postal: 'M4K 3R5', status: 'In Route', zone: 'East York', meals: 1 },
    { id: 'DEL-103', customer: 'Charlie Brown', address: '789 Pine Rd', postal: 'M6P 2T3', status: 'Delivered', zone: 'High Park', meals: 1 },
    { id: 'DEL-104', customer: 'Diana Prince', address: '101 Elm St', postal: 'M5A 1K2', status: 'Failed', zone: 'Downtown East', meals: 3 },
];

const MOCK_ROUTES = [
    { id: 'RT-001', date: 'Today', zone: 'Downtown Core', driver: 'John Doe', stops: 45, status: 'Active', progress: 60 },
    { id: 'RT-002', date: 'Today', zone: 'East York', driver: 'Jane Smith', stops: 32, status: 'Completed', progress: 100 },
    { id: 'RT-003', date: 'Tomorrow', zone: 'High Park', driver: 'Unassigned', stops: 28, status: 'Draft', progress: 0 },
];

export default function Deliveries() {
    const [activeTab, setActiveTab] = useState('overview');

    const KPIs = [
        { title: 'Today\'s Total', value: '315', icon: PackageOpen, color: 'text-blue-600' },
        { title: 'Delivered', value: '142', icon: CheckCircle, color: 'text-green-600' },
        { title: 'In Route', value: '168', icon: Truck, color: 'text-orange-600' },
        { title: 'Failed / Skipped', value: '5', icon: Clock, color: 'text-red-600' },
    ];

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Deliveries Management</h1>
                    <p className="text-gray-500 mt-1 text-sm">Zone routing, driver assignments, and live tracking</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Pick Date: Today
                    </Button>
                    <Button className="bg-primary hover:bg-orange-700 text-white rounded-card">
                        Generate Routes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-3xl grid-cols-6 mb-2 bg-gray-100">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="routes">Routes</TabsTrigger>
                    <TabsTrigger value="tracking">Live</TabsTrigger>
                    <TabsTrigger value="drivers">Drivers</TabsTrigger>
                    <TabsTrigger value="zones">Zones</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 flex-1">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {KPIs.map((kpi, idx) => (
                            <Card key={idx} className="shadow-sm border-gray-200 rounded-card">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-500">{kpi.title}</CardTitle>
                                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-text">{kpi.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-gray-400" />
                                Today's Deliveries List
                            </h2>
                            <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden">
                                <div className="p-3 border-b flex justify-between bg-gray-50">
                                    <Input placeholder="Search address or customer..." className="max-w-xs h-8 text-sm bg-white" />
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[130px] h-8 text-sm bg-white">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="planned">Planned</SelectItem>
                                            <SelectItem value="in_route">In Route</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Zone</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {MOCK_DELIVERIES_TODAY.map((del) => (
                                            <TableRow key={del.id} className="cursor-pointer hover:bg-gray-50">
                                                <TableCell className="font-medium">
                                                    {del.customer}
                                                    <p className="text-xs text-gray-500">{del.meals} Meals</p>
                                                </TableCell>
                                                <TableCell>
                                                    {del.address}
                                                    <p className="text-xs text-gray-500">{del.postal}</p>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">{del.zone}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={`border-0 ${del.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            del.status === 'In Route' ? 'bg-orange-100 text-orange-800' :
                                                                del.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {del.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-gray-400" />
                                Active Routes
                            </h2>
                            <div className="space-y-3">
                                {MOCK_ROUTES.filter(r => r.date === 'Today').map((route) => (
                                    <Card key={route.id} className="shadow-sm border-gray-200">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-text">{route.zone}</h3>
                                                    <p className="text-sm text-gray-500">{route.driver}</p>
                                                </div>
                                                <Badge variant="outline" className={`${route.status === 'Active' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-green-600 border-green-200 bg-green-50'}`}>
                                                    {route.status}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1 mt-4">
                                                <span className="text-gray-600">{route.progress}% Completed</span>
                                                <span className="font-medium text-text">{route.stops} Stops</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 mt-1 overflow-hidden">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${route.progress}%` }}></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="routes">
                    <div className="bg-white p-6 rounded-card shadow-sm border border-borderLight flex flex-col items-center justify-center h-[400px]">
                        <Navigation className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Route Management</h3>
                        <p className="text-gray-500 mb-4">Build and manage delivery routes by date and zone.</p>
                        <Button className="bg-primary text-white hover:bg-orange-700">Auto-assign Routes</Button>
                    </div>
                </TabsContent>

                <TabsContent value="tracking">
                    <div className="bg-white p-6 rounded-card shadow-sm border border-borderLight flex flex-col items-center justify-center h-[500px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-50 opacity-50 flex items-center justify-center">
                            <span className="text-blue-300 transform -rotate-12 text-6xl font-black">MAP UI MOCK</span>
                        </div>
                        <MapPin className="w-12 h-12 text-primary relative z-10 mb-2 drop-shadow-md" />
                        <h3 className="text-lg font-medium text-gray-900 relative z-10">Live Map Tracking</h3>
                        <p className="text-gray-500 relative z-10">Real-time driver locations and route progress will appear here.</p>
                    </div>
                </TabsContent>

                <TabsContent value="drivers">
                    <div className="bg-white p-6 rounded-card shadow-sm border border-borderLight flex flex-col items-center justify-center h-[400px]">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Driver Directory</h3>
                        <p className="text-gray-500 mb-4">Create drivers, manage availability, and assign default zones.</p>
                        <Button variant="outline">Add New Driver</Button>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
