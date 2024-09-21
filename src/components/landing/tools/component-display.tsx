//  src/components/landing/tools/component-display.tsx

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowUpLeftIcon,
  Bell,
  ChevronDown,
  Edit,
  Menu,
  MoreVertical,
  Plus,
  RocketIcon,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiArrowBendUpLeftBold } from "react-icons/pi";
import { Switch } from "@/components/ui/switch";

interface ComponentsDisplayProps {
  colorVariables: Record<string, string>;
  darkMode: boolean;
}

const revenueData = [
  { month: "Jan", value: 3000 },
  { month: "Feb", value: 4000 },
  { month: "Mar", value: 3500 },
  { month: "Apr", value: 3200 },
  { month: "May", value: 3800 },
  { month: "Jun", value: 4200 },
  { month: "Jul", value: 4800 },
];

const subscriptionData = [
  { month: "Jan", value: 1500 },
  { month: "Feb", value: 2500 },
  { month: "Mar", value: 2000 },
  { month: "Apr", value: 3000 },
  { month: "May", value: 2800 },
  { month: "Jun", value: 3200 },
  { month: "Jul", value: 3800 },
];

const exerciseData = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 40 },
  { day: "Wed", value: 35 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 49 },
  { day: "Sat", value: 60 },
  { day: "Sun", value: 70 },
];

const pieData = [
  { name: "Chart 1", value: 400 },
  { name: "Chart 2", value: 300 },
  { name: "Chart 3", value: 300 },
  { name: "Chart 4", value: 200 },
  { name: "Chart 5", value: 300 },
];

const ComponentsDisplay: React.FC<ComponentsDisplayProps> = ({
  colorVariables,
  darkMode,
}) => {
  const getColor = (variable: string) => `hsl(${colorVariables[variable]})`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: getColor("background"),
        color: getColor("foreground"),
      }}
    >
      <header
        className="w-full border-b p-4"
        style={{
          backgroundColor: getColor("background"),
          borderColor: getColor("border"),
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search..."
              className="max-w-sm"
              style={{
                backgroundColor: getColor("input"),
                borderColor: getColor("border"),
              }}
            />
            <Bell className="h-6 w-6" />
            <Settings className="h-6 w-6" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto p-6">
        {/* New Hero Section */}
        <section id="hero" className="mb-12">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <PiArrowBendUpLeftBold
                  style={{ color: getColor("primary") }}
                  className="h-16 w-16"
                />
                <h1
                  style={{ color: getColor("primary") }}
                  className="text-[42px] font-medium mb-2 text-balance max-w-3xl tracking-tighter"
                >
                  Welcome,
                </h1>
                <p
                  style={{ color: getColor("primary") }}
                  className="text-xl mb-4 max-w-lg"
                >
                  Get started by editing the theme to see changes here!
                </p>
                <div className="flex space-x-4">
                  <Button
                    variant="default"
                    onClick={() => (window.location.href = "#")}
                  >
                    Default
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => (window.location.href = "#")}
                  >
                    Destructive
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "#")}
                  >
                    Outline
                  </Button>
                </div>
              </div>
              <img
                alt="Dashboard Overview"
                className="aspect-video object-cover rounded-lg shadow-lg"
                src="https://via.placeholder.com/500"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$15,231.89</div>
              <div
                className="text-xs"
                style={{ color: getColor("muted-foreground") }}
              >
                +20.1% from last month
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getColor("chart-1")}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <div
                className="text-xs"
                style={{ color: getColor("muted-foreground") }}
              >
                +180.1% from last month
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={subscriptionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getColor("chart-2")}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle>Customer Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColor(`chart-${index + 1}`)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card
            className="md:col-span-2"
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle>Exercise Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exerciseData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getColor("chart-3")}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Settings Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Button Example */}
                <div>
                  <p className="mb-2 font-semibold">Buttons</p>
                  <div className="space-x-4">
                    <Button
                      style={{
                        backgroundColor: getColor("primary"),
                        color: getColor("primary-foreground"),
                      }}
                    >
                      Primary Button
                    </Button>
                    <Button
                      variant="outline"
                      style={{
                        borderColor: getColor("border"),
                        color: getColor("foreground"),
                      }}
                    >
                      Outline Button
                    </Button>
                  </div>
                </div>

                {/* Switch Example */}
                <div>
                  <p className="mb-2 font-semibold">Switch</p>
                  <Switch />
                </div>

                {/* Input Example */}
                <div>
                  <p className="mb-2 font-semibold">Input</p>
                  <Input
                    placeholder="Input Field"
                    style={{
                      backgroundColor: getColor("input"),
                      borderColor: getColor("border"),
                      color: getColor("foreground"),
                    }}
                  />
                </div>

                {/* Alert Example */}
                <div>
                  <p className="mb-2 font-semibold">Alert</p>
                  <Alert variant="destructive" className="mb-6">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      You can add components to your app using the cli.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Sofia Davis",
                    action: "Completed daily goal",
                    time: "2 hours ago",
                  },
                  {
                    name: "Jackson Lee",
                    action: "Added new team member",
                    time: "4 hours ago",
                  },
                  {
                    name: "Isabella Nguyen",
                    action: "Updated project status",
                    time: "Yesterday",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback
                        style={{
                          backgroundColor: getColor("muted"),
                          color: getColor("muted-foreground"),
                        }}
                      >
                        {activity.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: getColor("muted-foreground") }}
                      >
                        {activity.action}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: getColor("muted-foreground") }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: getColor("card"),
              color: getColor("card-foreground"),
              borderColor: getColor("border"),
            }}
          >
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      status: "Success",
                      email: "ken99@yahoo.com",
                      amount: "$316.00",
                    },
                    {
                      status: "Success",
                      email: "abe45@gmail.com",
                      amount: "$242.00",
                    },
                    {
                      status: "Processing",
                      email: "monserrat44@gmail.com",
                      amount: "$837.00",
                    },
                  ].map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell className="text-right">{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Alert variant="default" className="mb-6">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive" className="mb-6">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <footer
        className="mt-auto border-t p-4"
        style={{
          backgroundColor: getColor("background"),
          borderColor: getColor("border"),
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComponentsDisplay;
