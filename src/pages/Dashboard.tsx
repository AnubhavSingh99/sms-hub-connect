
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Send, Search } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the dashboard
const statsData = [
  { title: "Total Messages", icon: MessageSquare, value: "24,531", change: "+12%" },
  { title: "Active Contacts", icon: Users, value: "1,245", change: "+3%" },
  { title: "Messages Sent", icon: Send, value: "18,546", change: "+8%" },
  { title: "Search Queries", icon: Search, value: "642", change: "+24%" },
];

const chartData = [
  { name: "Jan", messages: 1200 },
  { name: "Feb", messages: 1900 },
  { name: "Mar", messages: 1800 },
  { name: "Apr", messages: 2400 },
  { name: "May", messages: 2300 },
  { name: "Jun", messages: 3000 },
  { name: "Jul", messages: 3500 },
];

const recentMessages = [
  { id: 1, contact: "John Doe", number: "+1234567890", message: "When will the package arrive?", time: "5 min ago" },
  { id: 2, contact: "Jane Smith", number: "+0987654321", message: "Thanks for your help!", time: "2 hours ago" },
  { id: 3, contact: "Mike Johnson", number: "+1122334455", message: "Please call me back when you can", time: "1 day ago" },
  { id: 4, contact: "Sarah Williams", number: "+5566778899", message: "The order has been confirmed", time: "2 days ago" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your SMS database management system dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-500">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Activity</CardTitle>
          <CardDescription>Number of messages processed monthly</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="messages" stroke="#6E59A5" fill="#E5DEFF" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Your latest SMS messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Message</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{msg.contact}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{msg.number}</td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]">{msg.message}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{msg.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
