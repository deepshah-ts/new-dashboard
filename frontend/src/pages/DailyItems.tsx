import { useState } from 'react';
import { PackageSearch, ListChecks, Printer, Activity, Filter, Settings2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function DailyItems() {
    const [activeTab, setActiveTab] = useState('plans');

    return (
        <div className="h-full flex flex-col space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Daily Operations</h1>
                    <p className="text-gray-500 mt-1 text-sm">Today's required meal prep aggregates, labels, and fulfillment metrics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200 text-gray-700 bg-white">
                        <Filter className="w-4 h-4 mr-2" />
                        Pick Date: Nov 15
                    </Button>
                    <Button className="bg-primary hover:bg-orange-700 text-white shadow-sm">
                        <Printer className="w-4 h-4 mr-2" /> Print All Labels
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="plans" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-2 bg-gray-100 p-1">
                    <TabsTrigger value="plans" className="flex items-center gap-2">
                        <PackageSearch className="w-4 h-4" /> Aggregate Plans
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4" /> By Customer
                    </TabsTrigger>
                    <TabsTrigger value="labels" className="flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Labels Generator
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Metrics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="plans" className="space-y-4 flex-1">
                    <Card className="rounded-card border-borderLight shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg">Total Required Meals</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">Aggregated counts required from the kitchen today.</p>
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter Store" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Kitchens</SelectItem>
                                        <SelectItem value="k1">Downtown Prep</SelectItem>
                                        <SelectItem value="k2">East End Prep</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="pl-6 w-[50%]">Meal Plan</TableHead>
                                        <TableHead className="text-right">Ordered</TableHead>
                                        <TableHead className="text-right">Skipped / Refunded</TableHead>
                                        <TableHead className="text-right pr-6 font-bold text-primary">Final Prep Target</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="hover:bg-gray-50">
                                        <TableCell className="pl-6 font-medium text-text">Standard Weekly (5 Days)</TableCell>
                                        <TableCell className="text-right text-gray-600">120</TableCell>
                                        <TableCell className="text-right text-red-500">-5</TableCell>
                                        <TableCell className="text-right pr-6 font-bold text-gray-800">115</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-gray-50">
                                        <TableCell className="pl-6 font-medium text-text">Premium Keto (20 Days)</TableCell>
                                        <TableCell className="text-right text-gray-600">45</TableCell>
                                        <TableCell className="text-right text-red-500">0</TableCell>
                                        <TableCell className="text-right pr-6 font-bold text-gray-800">45</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-gray-50 bg-orange-50/10">
                                        <TableCell className="pl-6 font-bold text-gray-800 uppercase text-xs tracking-wider">Kitchen Totals</TableCell>
                                        <TableCell className="text-right font-medium">165</TableCell>
                                        <TableCell className="text-right text-red-500 font-medium">-5</TableCell>
                                        <TableCell className="text-right pr-6 font-black text-primary text-lg">160</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="labels" className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 border border-borderLight rounded-card bg-gray-50 p-4 space-y-4">
                            <h3 className="font-semibold text-text border-b pb-2">Label Settings</h3>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Format</p>
                                <Select defaultValue="4x6">
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="4x6">4x6 Thermal (Zebra)</SelectItem>
                                        <SelectItem value="a4">A4 Sheet (Avery)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Include on label</p>
                                <label className="flex items-center gap-2 text-sm text-text cursor-pointer hover:bg-gray-200 p-1.5 rounded-md transition-colors"><input type="checkbox" defaultChecked className="accent-primary" /> Customer Name</label>
                                <label className="flex items-center gap-2 text-sm text-text cursor-pointer hover:bg-gray-200 p-1.5 rounded-md transition-colors"><input type="checkbox" defaultChecked className="accent-primary" /> Delivery Address</label>
                                <label className="flex items-center gap-2 text-sm text-text cursor-pointer hover:bg-gray-200 p-1.5 rounded-md transition-colors"><input type="checkbox" defaultChecked className="accent-primary" /> Dietary Tags</label>
                                <label className="flex items-center gap-2 text-sm text-text cursor-pointer hover:bg-gray-200 p-1.5 rounded-md transition-colors"><input type="checkbox" defaultChecked className="accent-primary" /> QR Code for Driver</label>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                        </div>

                        <div className="lg:col-span-3 bg-gray-200 rounded-card p-8 flex items-center justify-center relative shadow-inner border border-gray-300 overflow-hidden">
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant="outline" className="bg-white hover:bg-white text-gray-500 shadow-sm"><Settings2 className="w-3 h-3 mr-1" /> Preview Mode</Badge>
                            </div>
                            {/* Mock Label Rendering */}
                            <div className="w-[384px] h-[576px] bg-white shadow-xl rounded-[8px] p-6 flex flex-col justify-between transform transition-transform hover:scale-105 border border-gray-300">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start border-b-2 border-dashed border-gray-300 pb-3">
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 leading-none">JOHN DOE</h2>
                                            <p className="text-xl font-bold text-gray-600 mt-1">#C-10492</p>
                                        </div>
                                        <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center">
                                            <span className="text-white text-[10px] font-mono leading-[10px] text-center">MOCK<br />QR<br />CODE</span>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[15px] font-semibold text-gray-800 mb-1">STANDARD WEEKLY PLAN - 2 MEALS</p>
                                        <div className="flex gap-2">
                                            <span className="bg-orange-100 text-orange-900 text-xs font-bold px-2 py-0.5 rounded border border-orange-200">NO SPICE</span>
                                            <span className="bg-green-100 text-green-900 text-xs font-bold px-2 py-0.5 rounded border border-green-200">VEG</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="bg-gray-100 rounded-lg p-3 border border-gray-300 mt-4 mb-4 relative overflow-hidden">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 absolute top-0.5 right-2">DRIVER ROUTING</span>
                                        <h3 className="text-lg font-bold text-gray-900">ZONE: DOWNTOWN CO</h3>
                                        <p className="font-semibold text-gray-800 mt-1 text-base leading-tight">123 Maple Street<br />Unit 4B (Buzzer: 1092)</p>
                                        <p className="font-medium text-gray-700 mt-1 text-sm">Toronto, ON M5V 2H1</p>
                                    </div>

                                    <div className="border-t-2 border-gray-900 pt-2 flex justify-between items-end">
                                        <p className="text-[10px] font-mono font-medium text-gray-500">PACKED: NOV 15 08:32 AM<br />SEQ: 45 / 160</p>
                                        <h4 className="text-xl font-black text-primary tracking-tighter">TiffinStash</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                {/* Additional tabs logic omitted for brevity */}
            </Tabs>
        </div>
    );
}
