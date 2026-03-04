import { useState } from 'react';
import { Settings as SettingsIcon, Store, Plug, LayoutDashboard, Palette, BellRing, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">System Settings</h1>
                    <p className="text-gray-500 mt-1 text-sm">Configure your TiffinStash Admin Portal preferences</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="flex-1 flex flex-col lg:flex-row gap-6" onValueChange={setActiveTab}>
                {/* Vertical Tabs List for Settings */}
                <div className="lg:w-64 shrink-0">
                    <TabsList className="flex flex-col h-auto w-full bg-transparent items-start space-y-1 p-0">
                        <TabsTrigger value="general" className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md border border-transparent data-[state=active]:border-orange-200">
                            <SettingsIcon className="w-4 h-4 mr-2" /> General
                        </TabsTrigger>
                        <TabsTrigger value="stores" className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md border border-transparent data-[state=active]:border-orange-200">
                            <Store className="w-4 h-4 mr-2" /> Stores
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md border border-transparent data-[state=active]:border-orange-200">
                            <Plug className="w-4 h-4 mr-2" /> Integrations
                        </TabsTrigger>
                        <TabsTrigger value="portal" className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md border border-transparent data-[state=active]:border-orange-200">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Portal
                        </TabsTrigger>
                        <TabsTrigger value="display" className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md border border-transparent data-[state=active]:border-orange-200">
                            <Palette className="w-4 h-4 mr-2" /> Display
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="w-full justify-start text-left px-4 py-2 data-[state=active]:bg-orange-50 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md border border-transparent data-[state=active]:border-orange-200">
                            <BellRing className="w-4 h-4 mr-2" /> Notifications
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab Contents */}
                <div className="flex-1 min-w-0">
                    <TabsContent value="general" className="mt-0 space-y-6">
                        <Card className="rounded-card border-borderLight shadow-sm">
                            <CardHeader>
                                <CardTitle>Company Information</CardTitle>
                                <CardDescription>Basic system configuration and default values.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Company Name</Label>
                                        <Input defaultValue="TiffinStash Inc." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Support Email</Label>
                                        <Input defaultValue="support@tiffinstash.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Timezone</Label>
                                    <Input defaultValue="America/Toronto (EST)" />
                                </div>
                                <Button className="mt-4 bg-primary hover:bg-orange-700 text-white"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stores" className="mt-0 space-y-6">
                        <Card className="rounded-card border-borderLight shadow-sm">
                            <CardHeader>
                                <CardTitle>Store Management</CardTitle>
                                <CardDescription>Manage your multiple store locations and their settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border border-borderLight rounded-md bg-gray-50 flex items-center justify-center p-12 text-center text-gray-500">
                                    Store CRUD grid will appear here. Add new store buttons.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Other tabs omitted for brevity but they follow the same pattern */}
                    <TabsContent value="integrations" className="mt-0">
                        <Card className="rounded-card border-borderLight shadow-sm">
                            <CardHeader>
                                <CardTitle>API Integrations</CardTitle>
                                <CardDescription>Manage connections to external services.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border border-gray-200 p-4 rounded-md flex justify-between items-center bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-700 font-bold">Sh</div>
                                        <div>
                                            <h4 className="font-semibold text-text">Shopify</h4>
                                            <p className="text-xs text-gray-500">Connected to store: tiffinstash.myshopify.com</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Disconnect</Button>
                                </div>
                                <div className="border border-gray-200 p-4 rounded-md flex justify-between items-center bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold">St</div>
                                        <div>
                                            <h4 className="font-semibold text-text">Stripe</h4>
                                            <p className="text-xs text-gray-500">Receiving live payouts.</p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Configure</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="display" className="mt-0 space-y-6">
                        <Card className="rounded-card border-borderLight shadow-sm">
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>Customize the admin UI look and feel.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 border border-borderLight p-4 rounded-md">
                                    <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
                                    <div>
                                        <p className="font-semibold text-text text-sm">Light Mode (Default)</p>
                                        <p className="text-xs text-gray-500">Active design style.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border border-borderLight p-4 rounded-md bg-gray-50 cursor-not-allowed opacity-60">
                                    <div className="w-6 h-6 rounded-full bg-gray-900 border border-gray-900"></div>
                                    <div>
                                        <p className="font-semibold text-text text-sm">Dark Mode</p>
                                        <p className="text-xs text-gray-500">Coming soon.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0">
                        <Card className="rounded-card border-borderLight shadow-sm">
                            <CardHeader>
                                <CardTitle>System Notifications</CardTitle>
                                <CardDescription>Control alerts sent via email or dashboard.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border border-borderLight rounded-md bg-gray-50 flex items-center justify-center p-12 text-center text-gray-500">
                                    Notification toggles (e.g., "Email me on failed payments")
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="portal" className="mt-0">
                        <Card className="rounded-card border-borderLight shadow-sm">
                            <CardHeader>
                                <CardTitle>Portal Branding</CardTitle>
                                <CardDescription>Customer-facing assets and texts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border border-borderLight rounded-md bg-gray-50 flex items-center justify-center p-12 text-center text-gray-500">
                                    Image uploaders for logos, color pickers, and custom CSS overrides.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
