import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Plus, Send, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useToast } from "../hooks/use-toast";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
    fetchMessages();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredConversations = messages.filter(
    msg =>
      (msg.contactName && msg.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (msg.number && msg.number.includes(searchTerm))
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedConversation.contactId,
          content: newMessage,
          incoming: false,
          time: new Date(),
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const sentMessage = await response.json();
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(conv => {
          if (conv.contactId === sentMessage.contactId) {
            return {
              ...conv,
              messages: [...conv.messages, sentMessage],
            };
          }
          return conv;
        });
        return updatedMessages;
      });
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateNewMessage = async () => {
    if (!selectedContact || !newMessageContent.trim()) return;
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedContact,
          content: newMessageContent,
          incoming: false,
          time: new Date(),
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const sentMessage = await response.json();
      // Optionally refresh messages or add new conversation
      fetchMessages();
      setSelectedContact("");
      setNewMessageContent("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
                      <SelectItem key={contact._id} value={contact._id}>
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
                        key={conv._id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                          selectedConversation && selectedConversation._id === conv._id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <Avatar>
                          <AvatarFallback className="bg-sms-primary/10 text-sms-primary">
                            {getInitials(conv.contactName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{conv.contactName}</p>
                            <span className="text-xs text-muted-foreground">
                              {conv.messages && conv.messages.length > 0
                                ? new Date(conv.messages[conv.messages.length - 1].time).toLocaleString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.messages && conv.messages.length > 0
                              ? conv.messages[conv.messages.length - 1].content
                              : ""}
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
                      {getInitials(selectedConversation.contactName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedConversation.contactName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedConversation.contactNumber}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                      selectedConversation.messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${msg.incoming ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.incoming ? "bg-muted text-foreground" : "bg-sms-primary text-primary-foreground"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.incoming ? "text-muted-foreground" : "text-primary-foreground/70"
                              }`}
                            >
                              {new Date(msg.time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No messages</p>
                    )}
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
