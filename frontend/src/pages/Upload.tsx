import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const MOCK_PREVIEW = [
    { row: 1, name: 'John Doe', email: 'john@example.com', plan: 'Weekly Standard', valid: true },
    { row: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Keto Monthly', valid: true },
    { row: 3, name: 'Error Case', email: 'invalid-email', plan: 'Unknown Plan', valid: false, error: 'Invalid Email format' },
];

const MOCK_HISTORY = [
    { id: 1, filename: 'customers-nov.csv', date: '2023-11-20T10:00:00Z', status: 'Completed', rows: 45 },
    { id: 2, filename: 'orders-batch2.csv', date: '2023-11-19T14:30:00Z', status: 'Completed', rows: 12 },
    { id: 3, filename: 'corrupted-data.csv', date: '2023-11-18T09:15:00Z', status: 'Failed', rows: 0 },
];

export default function Upload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setTimeout(() => setPreview(true), 1500); // Simulate parsing
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text">Data Upload</h1>
                    <p className="text-gray-500 mt-1 text-sm">Bulk import customers, orders, or meal plans via CSV</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Zone */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    <Card className="border-dashed border-2 border-gray-300 shadow-none bg-gray-50 hover:bg-gray-100 transition-colors">
                        <CardContent className="p-12 text-center" onDragOver={handleDragOver} onDrop={handleDrop}>
                            <UploadCloud className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop your CSV here</h3>
                            <p className="text-sm text-gray-500 mb-6">or click to browse from your computer.</p>
                            <div className="flex justify-center">
                                <Button className="bg-primary text-white hover:bg-orange-700">Browse Files</Button>
                            </div>
                            {file && (
                                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-700 bg-white p-2 rounded-md border border-gray-200 inline-flex mx-auto">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    {file.name}
                                    {preview ? <CheckCircle className="w-4 h-4 text-green-500 ml-2" /> : <Clock className="w-4 h-4 text-orange-500 animate-spin ml-2" />}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preview Table */}
                    {preview && (
                        <div className="bg-white rounded-card shadow-sm border border-borderLight overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-semibold text-text">Preview Data ({MOCK_PREVIEW.length} rows)</h3>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Import Valid Records</Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Row</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Mapped Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_PREVIEW.map((row) => (
                                        <TableRow key={row.row} className={row.valid ? '' : 'bg-red-50/50'}>
                                            <TableCell className="text-gray-500">{row.row}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.plan}</TableCell>
                                            <TableCell>
                                                {row.valid ? (
                                                    <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1 w-max">
                                                        <CheckCircle className="w-3 h-3" /> Valid
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-100 text-red-800 border-0 flex items-center gap-1 w-max" title={row.error}>
                                                        <AlertCircle className="w-3 h-3" /> Error
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Upload History */}
                <div className="col-span-1">
                    <h2 className="text-lg font-semibold text-text mb-3">Recent Uploads</h2>
                    <div className="space-y-3">
                        {MOCK_HISTORY.map((hist) => (
                            <Card key={hist.id} className="shadow-sm border-gray-200">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <div className={`p-2 rounded-full mt-0.5 ${hist.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {hist.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-text truncate w-48" title={hist.filename}>{hist.filename}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(hist.date).toLocaleString()}</p>
                                        <p className="text-xs font-medium mt-1">
                                            {hist.status === 'Completed' ? `${hist.rows} rows imported` : 'Import failed'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
