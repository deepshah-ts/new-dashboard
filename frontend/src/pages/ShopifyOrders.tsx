import { useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle, Clock, XCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

// Mock data for Shopify Orders
const MOCK_ORDERS = [
    { id: '1001', orderNumber: '#40921', customerName: 'Alice Smith', phone: '(555) 123-4567', products: '2x Standard Weekly', total: 150.00, date: '2023-11-15T10:30:00Z', status: 'Ready to Approve', type: 'Pending' },
    { id: '1002', orderNumber: '#40922', customerName: 'Bob Johnson', phone: '(555) 987-6543', products: '1x Premium Monthly', total: 550.00, date: '2023-11-15T11:45:00Z', status: 'Require Attention', type: 'Pending', issue: 'Missing address details' },
    { id: '1003', orderNumber: '#40923', customerName: 'Charlie Brown', phone: '(555) 555-5555', products: '1x Basic Weekly', total: 100.00, date: '2023-11-14T14:20:00Z', status: 'Approved', type: 'Orders' },
    { id: '1004', orderNumber: '#40924', customerName: 'Diana Prince', phone: '(555) 111-2222', products: '3x Standard Monthly', total: 1200.00, date: '2023-11-14T09:15:00Z', status: 'Under Review', type: 'Orders' },
    { id: '1005', orderNumber: '#40925', customerName: 'Evan Davis', phone: '(555) 333-4444', products: '1x Premium Weekly', total: 180.00, date: '2023-11-13T16:00:00Z', status: 'On Hold', type: 'Orders', issue: 'Awaiting EMT transfer' },
    { id: '1006', orderNumber: '#40926', customerName: 'Fiona Gallagher', phone: '(555) 444-5555', products: 'Trial Box', total: 45.00, date: '2023-11-13T10:00:00Z', status: 'Rejected', type: 'Orders', issue: 'Outside delivery zone' },
];

export default function ShopifyOrders() {
    const [selectedOrder, setSelectedOrder] = useState<(typeof MOCK_ORDERS)[0] | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');

    // Modals / forms state for actions inside drawer
    const [showHoldInput, setShowHoldInput] = useState(false);
    const [holdReason, setHoldReason] = useState('');
    const [reviewNote, setReviewNote] = useState('');

    const handleRowClick = (order: typeof MOCK_ORDERS[0]) => {
        setSelectedOrder(order);
        setShowHoldInput(false);
        setHoldReason('');
        setReviewNote('');
        setIsDrawerOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Ready to Approve': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">Ready</Badge>;
            case 'Require Attention': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Attention</Badge>;
            case 'Under Review': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0 flex items-center gap-1"><Clock className="w-3 h-3" /> In Review</Badge>;
            case 'Approved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</Badge>;
            case 'Rejected': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
            case 'On Hold': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-0">On Hold</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredOrders = MOCK_ORDERS.filter(order =>
        activeTab === 'pending' ? order.type === 'Pending' : order.type === 'Orders'
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Shopify Orders</h1>
                    <p className="text-gray-500 mt-1 text-sm">Review, approve, and manage incoming Shopify syncs</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full flex-1 flex flex-col" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-2 bg-gray-100">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Pending Action <Badge className="ml-2 bg-primary text-white border-0">{MOCK_ORDERS.filter(o => o.type === 'Pending').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        All Orders
                    </TabsTrigger>
                </TabsList>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-card shadow-sm border border-borderLight w-full my-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                        <div className="relative w-full max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search order#, name, phone..." className="pl-9 bg-gray-50 border-gray-200" />
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {activeTab === 'pending' ? (
                                    <>
                                        <SelectItem value="ready">Ready to Approve</SelectItem>
                                        <SelectItem value="attention">Require Attention</SelectItem>
                                    </>
                                ) : (
                                    <>
                                        <SelectItem value="review">Under Review</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="hold">On Hold</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 border border-gray-200 bg-gray-50 px-3 py-2 rounded-md cursor-not-allowed">
                            <Filter className="w-4 h-4" />
                            <span>Date Range</span>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden flex-1">
                    <Table>
                        <TableHeader className="bg-gray-50 border-b border-borderLight sticky top-0">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-600">Order</TableHead>
                                <TableHead className="font-semibold text-gray-600">Date</TableHead>
                                <TableHead className="font-semibold text-gray-600">Customer</TableHead>
                                <TableHead className="font-semibold text-gray-600">Products</TableHead>
                                <TableHead className="text-right font-semibold text-gray-600">Total (CAD)</TableHead>
                                <TableHead className="font-semibold text-gray-600 text-center">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-gray-500">
                                        No orders found in this view.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${order.status === 'Require Attention' ? 'bg-red-50/30' : ''}`}
                                        onClick={() => handleRowClick(order)}
                                    >
                                        <TableCell className="font-medium text-primary">{order.orderNumber}</TableCell>
                                        <TableCell className="text-gray-600 text-sm">{new Date(order.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <p className="font-medium text-text">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.phone}</p>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-sm max-w-[200px] truncate" title={order.products}>{order.products}</TableCell>
                                        <TableCell className="text-right font-medium text-gray-800">${order.total.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>

            {/* Order Detail Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] sm:max-w-md p-0 overflow-y-auto bg-white flex flex-col">
                    {selectedOrder && (
                        <>
                            {/* Drawer Header */}
                            <div className="bg-gray-50 border-b border-borderLight p-6">
                                <SheetHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <SheetTitle className="text-2xl font-bold text-text flex items-center gap-2">
                                                {selectedOrder.orderNumber}
                                                {getStatusBadge(selectedOrder.status)}
                                            </SheetTitle>
                                            <SheetDescription className="mt-1">
                                                Imported from Shopify on {new Date(selectedOrder.date).toLocaleString()}
                                            </SheetDescription>
                                        </div>
                                    </div>
                                </SheetHeader>
                            </div>

                            {/* Drawer Content */}
                            <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                                {/* Warnings / Issues */}
                                {selectedOrder.issue && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md text-sm flex gap-3 items-start">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                        <div>
                                            <strong className="block mb-1">Attention Required</strong>
                                            {selectedOrder.issue}
                                        </div>
                                    </div>
                                )}

                                {/* Customer Snapshot */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-gray-500">Customer</Label>
                                        <p className="font-medium text-text">{selectedOrder.customerName}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Order Value</Label>
                                        <p className="font-medium text-text">${selectedOrder.total.toFixed(2)} CAD</p>
                                        <p className="text-sm text-gray-500">Paid securely via Shopify</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <Label className="text-xs text-gray-500 mb-2 block">Line Items (Mapped)</Label>
                                    <div className="bg-gray-50 border border-borderLight rounded-md p-3">
                                        <div className="flex justify-between text-sm font-medium mb-1">
                                            <span>{selectedOrder.products}</span>
                                            <span>${selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Maps to internal Meal Plan: <span className="text-primary">Standard Plan (5 Days)</span></p>
                                    </div>
                                </div>

                                {/* Review Note Section */}
                                <div className="border-t border-gray-100 pt-4">
                                    <Label className="text-xs text-gray-500 mb-2 block">Internal Review Note</Label>
                                    <Textarea
                                        placeholder="Add a note regarding this order's approval or rejection..."
                                        value={reviewNote}
                                        onChange={(e) => setReviewNote(e.target.value)}
                                        className="min-h-[80px]"
                                    />
                                </div>

                                {/* Conditional Input for 'On Hold' */}
                                {showHoldInput && (
                                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
                                        <Label className="text-orange-900 mb-2 block">Reason for putting On Hold</Label>
                                        <Input
                                            placeholder="E.g., Awaiting EMT confirmation"
                                            value={holdReason}
                                            onChange={(e) => setHoldReason(e.target.value)}
                                            className="bg-white border-orange-200"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Drawer Footer Actions - Sticks to bottom */}
                            <div className="border-t border-borderLight p-4 bg-gray-50 flex flex-wrap gap-2 justify-end mt-auto">
                                {!showHoldInput ? (
                                    <>
                                        <Button variant="outline" className="border-gray-200" onClick={() => setShowHoldInput(true)}>
                                            Put On Hold
                                        </Button>
                                        <Button variant="outline" className="text-gray-700 bg-white hover:bg-gray-100 border-gray-200">
                                            Move to Review
                                        </Button>
                                        <Button variant="outline" className="text-red-600 bg-red-50 hover:bg-red-100 border-red-200">
                                            Reject
                                        </Button>
                                        <Button className="bg-primary hover:bg-orange-700 text-white shadow-sm flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Approve & Create Subscription
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" onClick={() => setShowHoldInput(false)}>Cancel</Button>
                                        <Button className="bg-orange-600 hover:bg-orange-700 text-white" disabled={!holdReason.trim()}>
                                            Confirm Hold
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
