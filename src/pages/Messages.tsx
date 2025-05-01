
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Send, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data
const messages = [
  { 
    id: 1, 
    contact: "John Doe", 
    number: "+1234567890", 
    messages: [
      { id: 1, content: "Hey, I was wondering about our appointment", time: "10:30 AM", incoming: true },
      { id: 2, content: "Yes, it's still scheduled for tomorrow at 2 PM", time: "10:35 AM", incoming: false },
      { id: 3, content: "Great, thank you for confirming!", time: "10:38 AM", incoming: true },
    ]
  },
  { 
    id: 2, 
    contact: "Jane Smith", 
    number: "+0987654321", 
    messages: [
      { id: 1, content: "The documents have been sent to your email", time: "Yesterday", incoming: false },
      { id: 2, content: "Thank you! I've received them", time: "Yesterday", incoming: true },
    ]
  },
  { 
    id: 3, 
    contact: "Mike Johnson", 
    number: "+1122334455", 
    messages: [
      { id: 1, content: "Please call me when you have a moment", time: "2 days ago", incoming: true },
      { id: 2, content: "I'll call you in about 30 minutes", time: "2 days ago", incoming: false },
      { id: 3, content: "Perfect, I'll be available", time: "2 days ago", incoming: true },
    ]
  },
];

// Mock contacts data
const contacts = [
  { id: 1, name: "John Doe", number: "+1234567890" },
  { id: 2, name: "Jane Smith", number: "+0987654321" },
  { id: 3, name: "Mike Johnson", number: "+1122334455" },
  { id: 4, name: "Sarah Williams", number: "+5566778899" },
  { id: 5, name: "Alex Brown", number: "+1231231234" },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(messages[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  
  // Filter messages based on search term
  const filteredConversations = messages.filter(
    msg => msg.contact.toLowerCase().includes(searchTerm.toLowerCase()) || 
           msg.number.includes(searchTerm)
  );

  // Handle sending new message in an existing conversation
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
    // Here you would typically make an API call to send the message
  };

  // Handle creating a new message conversation
  const handleCreateNewMessage = () => {
    if (!selectedContact || !newMessageContent.trim()) return;
    console.log("New message to:", selectedContact, "Content:", newMessageContent);
    // Here you would typically make an API call to send the message and create a conversation
    setSelectedContact("");
    setNewMessageContent("");
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sms-primary hover:bg-sms-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
              <DialogDescription>
                Create a new SMS message to send to a contact.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.number}>
                        {contact.name} ({contact.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Textarea
                  placeholder="Type your message here"
                  className="min-h-[100px]"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="bg-sms-primary hover:bg-sms-primary/90"
                onClick={handleCreateNewMessage}
              >
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="w-full bg-transparent border-b rounded-none p-0">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                <div className="max-h-[500px] overflow-auto">
                  {filteredConversations.length === 0 ? (
                    <p className="p-4 text-center text-muted-foreground">No conversations found</p>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 ${selectedConversation.id === conv.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <Avatar>
                          <AvatarFallback className="bg-sms-primary/10 text-sms-primary">
                            {getInitials(conv.contact)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{conv.contact}</p>
                            <span className="text-xs text-muted-foreground">
                              {conv.messages[conv.messages.length - 1].time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.messages[conv.messages.length - 1].content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <p className="p-4 text-center text-muted-foreground">No unread messages</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-sms-primary/10 text-sms-primary">
                      {getInitials(selectedConversation.contact)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedConversation.contact}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.number}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.incoming ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.incoming
                              ? "bg-muted text-foreground"
                              : "bg-sms-primary text-primary-foreground"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.incoming ? "text-muted-foreground" : "text-primary-foreground/70"
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-sms-primary hover:bg-sms-primary/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-center">
              <div>
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Conversation Selected</h3>
                <p className="text-muted-foreground">
                  Select a conversation from the sidebar or create a new message
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
