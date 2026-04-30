import { motion } from "motion/react";
import { 
  Download, 
  Printer, 
  Filter, 
  Add, 
  Search, 
  Upload, 
  Document, 
  CheckmarkFilled, 
  WarningFilled, 
  Time 
} from "@carbon/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { Separator } from "./ui/separator";

export function GenericPage({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  onBreadcrumbNavigate,
  type = "default",
  version
}: GenericPageProps) {

  // Determine layout type if not explicitly provided
  const getLayoutType = () => {
    if (type !== "default") return type;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("dashboard") || lowerTitle.includes("summary") || lowerTitle.includes("metrics") || lowerTitle.includes("analysis")) return "dashboard";
    if (lowerTitle.includes("upload")) return "upload";
    if (lowerTitle.includes("report") || lowerTitle.includes("log") || lowerTitle.includes("list") || lowerTitle.includes("history") || lowerTitle.includes("search") || lowerTitle.includes("tracking") || lowerTitle.includes("cases") || lowerTitle.includes("open") || lowerTitle.includes("pending")) return "table";
    if (lowerTitle.includes("config") || lowerTitle.includes("maintenance") || lowerTitle.includes("create") || lowerTitle.includes("builder") || lowerTitle.includes("settings")) return "form";
    return "table"; // Default to table for most list-like items
  };

  const layout = getLayoutType();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-end gap-2 px-4">

        <Button variant="outline" className="gap-2 h-10 text-sm">
          Print
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="gap-2 h-10 text-sm">
          Export
          <Download className="h-4 w-4" />
        </Button>
        {(layout === "table" || layout === "form") && (
          <Button className="bg-[#2A53A0] hover:bg-[#2A53A0]/90 gap-2 h-10 text-sm">
            New {title.split(" ")[0]}
            <Add className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        {layout === "dashboard" && <DashboardLayout title={title} />}
        {layout === "table" && <TableLayout title={title} />}
        {layout === "form" && <FormLayout title={title} />}
        {layout === "upload" && <UploadLayout title={title} />}
      </div>
    </motion.div>
  );
}

// --- Sub-Layout Components ---

function DashboardLayout({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: "1,248", change: "+12%", icon: Document },
          { label: "Active", value: "842", change: "+5%", icon: CheckmarkFilled },
          { label: "Pending", value: "125", change: "-2%", icon: Time },
          { label: "Issues", value: "14", change: "+1", icon: WarningFilled, color: "text-red-500" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-gray-500 ${stat.color || ""}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className={stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{title} Overview</CardTitle>
            <CardDescription>Monthly activity and trends.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[240px] flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-md border border-dashed border-gray-200 dark:border-gray-800">
                Chart Visualization Placeholder
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Updated configuration</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TableLayout({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title} Records</CardTitle>
            <CardDescription>Manage and view your {title.toLowerCase()}.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input placeholder="Search..." className="pl-9 w-[200px] h-10" />
             </div>
             <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
             </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">ID</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Last Updated</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                  <tr key={row} className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4 font-medium">REF-{1000 + row}</td>
                    <td className="p-4">{title} Item {row}</td>
                    <td className="p-4">
                      <Badge variant={row % 3 === 0 ? "secondary" : "outline"} className={row % 3 === 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}>
                        {row % 3 === 0 ? "Active" : "Processing"}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500">2024-03-{10 + row}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" className="h-10">Previous</Button>
          <Button variant="outline" className="h-10">Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FormLayout({ title }: { title: string }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{title} Configuration</CardTitle>
        <CardDescription>Update the settings for {title}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Configuration Name</label>
          <Input placeholder={`Enter ${title.toLowerCase()} name`} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-sm font-medium">Category</label>
             <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
               <option>General</option>
               <option>Advanced</option>
               <option>System</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium">Priority</label>
             <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
               <option>High</option>
               <option>Medium</option>
               <option>Low</option>
             </select>
           </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Enter description details..." />
        </div>

        <div className="flex items-center gap-4 pt-4">
           <Button className="bg-[#2A53A0] h-10">Save Changes</Button>
           <Button variant="outline" className="h-10">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadLayout({ title }: { title: string }) {
  return (
    <Card className="max-w-2xl mx-auto">
       <CardHeader>
         <CardTitle>Upload {title}</CardTitle>
         <CardDescription>Upload data files for processing.</CardDescription>
       </CardHeader>
       <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
             <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8" />
             </div>
             <h3 className="text-lg font-medium mb-2">Click to upload or drag and drop</h3>
             <p className="text-sm text-gray-500 max-w-xs mx-auto">
               SVG, PNG, JPG or GIF (max. 800x400px) or CSV, XLS for data.
             </p>
          </div>
          
          <div className="space-y-4">
             <h4 className="text-sm font-medium">Recent Uploads</h4>
             {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                   <div className="flex items-center gap-3">
                      <Document className="h-5 w-5 text-gray-400" />
                      <div>
                         <p className="text-sm font-medium">data_batch_2024_{i}.csv</p>
                         <p className="text-xs text-gray-500">2.4 MB • Uploaded 2 days ago</p>
                      </div>
                   </div>
                   <Badge variant="outline" className="text-green-600 bg-green-50">Completed</Badge>
                </div>
             ))}
          </div>
       </CardContent>
    </Card>
  );
}
