
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, MessageSquare, Users, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  // Mock search results
  const mockResults = {
    messages: [
      { 
        id: 1,
        contact: "John Doe",
        number: "+1234567890",
        content: "I need to reschedule our appointment to next week. Is that possible?",
        date: "2023-04-15T10:30:00"
      },
      { 
        id: 2,
        contact: "Jane Smith",
        number: "+0987654321",
        content: "Thank you for the information about the new product launch.",
        date: "2023-04-10T14:20:00"
      },
      { 
        id: 3,
        contact: "Mike Johnson",
        number: "+1122334455",
        content: "Can you provide more details about the service options?",
        date: "2023-04-05T09:15:00"
      }
    ],
    contacts: [
      {
        id: 1,
        name: "John Doe",
        number: "+1234567890",
        email: "john@example.com",
        tags: ["Customer", "VIP"]
      },
      {
        id: 2,
        name: "Jane Smith",
        number: "+0987654321",
        email: "jane@example.com",
        tags: ["Customer"]
      }
    ]
  };

  // Handle search submission
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (searchType === "all" || searchType === "messages") {
        setSearchResults(mockResults.messages.filter(msg => 
          msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.contact.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else if (searchType === "contacts") {
        setSearchResults(mockResults.contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.number.includes(searchTerm) ||
          (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
        ));
      }
      
      setIsSearching(false);
    }, 500);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Search through messages and contacts in your database.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter keywords to search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Search in..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="messages">Messages</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <DatePicker date={dateFrom} setDate={setDateFrom} />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <DatePicker date={dateTo} setDate={setDateTo} />
            </div>
            <div className="md:self-end">
              <Button 
                className="w-full md:w-auto bg-sms-primary hover:bg-sms-primary/90"
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResults !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={searchType === "contacts" ? "contacts" : "messages"}>
              <TabsList className="w-full">
                {searchType !== "contacts" && (
                  <TabsTrigger value="messages" className="flex items-center gap-2 flex-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </TabsTrigger>
                )}
                {searchType !== "messages" && (
                  <TabsTrigger value="contacts" className="flex items-center gap-2 flex-1">
                    <Users className="h-4 w-4" />
                    <span>Contacts</span>
                  </TabsTrigger>
                )}
              </TabsList>
              
              {searchType !== "contacts" && (
                <TabsContent value="messages">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No messages found</h3>
                      <p className="text-muted-foreground">
                        Try changing your search terms or filters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((result) => (
                        <div key={result.id} className="border rounded-md p-4 hover:bg-muted/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-sms-primary/10 text-sms-primary text-xs">
                                {getInitials(result.contact)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{result.contact}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{result.number}</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(result.date)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{result.content}</p>
                          <div className="mt-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              View in Conversation
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}
              
              {searchType !== "messages" && (
                <TabsContent value="contacts">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No contacts found</h3>
                      <p className="text-muted-foreground">
                        Try changing your search terms or filters
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((contact) => (
                            <tr key={contact.id} className="border-b hover:bg-muted/50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-sms-primary/10 text-sms-primary text-xs">
                                      {getInitials(contact.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{contact.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">{contact.number}</td>
                              <td className="px-4 py-3 text-sm">{contact.email}</td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {contact.tags.map((tag: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sms-accent/30 text-sms-primary"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button 
                                  size="sm" 
                                  className="text-xs bg-sms-primary hover:bg-sms-primary/90"
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Message
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;
