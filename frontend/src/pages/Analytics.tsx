import { useState } from 'react';
import { Calendar as CalendarIcon, Package, UserCheck, RefreshCw, Upload, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Placeholder mock charts
function MockChart({ title, type }: { title: string, type: 'bar' | 'line' }) {
    return (
        <Card className="shadow-sm border-gray-200 rounded-card col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-text">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 flex flex-col justify-end gap-1 p-4">
                        {/* rudimentary CSS mock chart */}
                        {type === 'bar' ? (
                            <div className="flex items-end justify-between h-full w-full gap-2">
                                {[40, 70, 45, 90, 60, 110, 85].map((h, i) => (
                                    <div key={i} className="bg-primary w-full rounded-t-sm" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,80 Q20,60 40,70 T80,30 L100,40" fill="none" stroke="#DE5200" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <span className="text-gray-400 font-medium z-10">{title} Visualization Placeholder</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Analytics() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1 text-sm">Deep dive into revenue, costs, and customer retention metrics.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200 text-gray-700 bg-white">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Last 30 Days
                    </Button>
                    <Button variant="outline" className="border-gray-200 text-gray-700 bg-white shadow-sm">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-2 bg-gray-100">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="costing">Costing</TabsTrigger>
                    <TabsTrigger value="pl">P&L</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 flex-1">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="shadow-sm border-gray-200 rounded-card">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Gross Revenue (CAD)</p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-text">$124,500.00</h3>
                                </div>
                                <div className="flex items-center text-sm font-medium text-green-600 mt-2">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +12.5% vs last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 rounded-card">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Net Profit Margin</p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-text">24.8%</h3>
                                </div>
                                <div className="flex items-center text-sm font-medium text-green-600 mt-2">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +1.2% point expansion
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 rounded-card">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Customer Churn Rate</p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-text">4.2%</h3>
                                </div>
                                <div className="flex items-center text-sm font-medium text-red-600 mt-2">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +0.5% vs last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 rounded-card">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Avg Meals per Order</p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-3xl font-bold text-text">14.5</h3>
                                </div>
                                <div className="flex items-center text-sm font-medium text-gray-500 mt-2">
                                    <ArrowDownRight className="w-4 h-4 mr-1 text-gray-400" />
                                    Flat MoM
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <MockChart title="Revenue vs COGS (Last 6 Months)" type="bar" />

                        <Card className="shadow-sm border-gray-200 rounded-card col-span-1 lg:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold text-text">Top Performing Meal Plans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-2">
                                    {[
                                        { plan: 'Weekly Standard (5 Days)', share: 45, rev: '$56,025' },
                                        { plan: 'Monthly Premium (20 Days)', share: 30, rev: '$37,350' },
                                        { plan: 'Trial Box', share: 15, rev: '$18,675' },
                                        { plan: 'Keto Special', share: 10, rev: '$12,450' }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-text">{item.plan}</span>
                                                <span className="text-gray-500">{item.rev}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${item.share}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <MockChart title="Active Subscriber Growth" type="line" />
                        <div className="col-span-1 lg:col-span-2 bg-orange-50 border border-orange-200 p-6 rounded-card flex flex-col justify-center items-center text-center">
                            <UserCheck className="w-10 h-10 text-primary mb-3" />
                            <h3 className="text-lg font-bold text-orange-900 mb-2">Generate Retention Report</h3>
                            <p className="text-sm text-orange-700 mb-4 max-w-sm">Deep dive into cohort analysis to see how long customers stay subscribed based on their acquisition month.</p>
                            <Button className="bg-primary hover:bg-orange-700 text-white shadow-sm">Run Report</Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="revenue">
                    <div className="h-[400px] flex items-center justify-center bg-gray-50 border border-borderLight rounded-card">
                        <p className="text-gray-500">Revenue Breakdown Details</p>
                    </div>
                </TabsContent>
                {/* Additional tab contents omitted for brevity, would follow similar patterns */}
            </Tabs>
        </div>
    );
}
