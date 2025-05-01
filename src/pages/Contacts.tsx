
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Mock data
const initialContacts = [
  { id: 1, name: "John Doe", number: "+1234567890", email: "john@example.com", lastContact: "2 days ago", tags: ["Customer", "VIP"] },
  { id: 2, name: "Jane Smith", number: "+0987654321", email: "jane@example.com", lastContact: "1 week ago", tags: ["Customer"] },
  { id: 3, name: "Mike Johnson", number: "+1122334455", email: "mike@example.com", lastContact: "3 days ago", tags: ["Supplier"] },
  { id: 4, name: "Sarah Williams", number: "+5566778899", email: "sarah@example.com", lastContact: "1 month ago", tags: ["Customer", "New"] },
  { id: 5, name: "Alex Brown", number: "+1231231234", email: "alex@example.com", lastContact: "2 weeks ago", tags: ["Lead"] },
  { id: 6, name: "Emily Davis", number: "+4564564567", email: "emily@example.com", lastContact: "Yesterday", tags: ["Customer"] },
  { id: 7, name: "Robert Wilson", number: "+7897897890", email: "robert@example.com", lastContact: "3 weeks ago", tags: ["Lead"] },
];

const Contacts = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", number: "", email: "" });
  const [editingContact, setEditingContact] = useState<null | typeof initialContacts[0]>(null);
  const { toast } = useToast();

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              contact.number.includes(searchTerm) ||
              contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Handle adding a new contact
  const handleAddContact = () => {
    if (!newContact.name || !newContact.number) {
      toast({
        title: "Error",
        description: "Name and number are required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...contacts.map(c => c.id)) + 1;
    setContacts([
      ...contacts,
      {
        id: newId,
        ...newContact,
        lastContact: "Never",
        tags: ["New"]
      }
    ]);
    
    setNewContact({ name: "", number: "", email: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your contacts.`,
    });
  };

  // Handle editing contact
  const handleEditContact = () => {
    if (!editingContact || !editingContact.name || !editingContact.number) {
      toast({
        title: "Error",
        description: "Name and number are required fields",
        variant: "destructive",
      });
      return;
    }

    setContacts(contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ));
    
    setEditingContact(null);
    
    toast({
      title: "Contact Updated",
      description: `${editingContact.name}'s information has been updated.`,
    });
  };

  // Handle deleting contact
  const handleDeleteContact = (id: number, name: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    
    toast({
      title: "Contact Deleted",
      description: `${name} has been removed from your contacts.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sms-primary hover:bg-sms-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Enter the details of your new contact below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="number" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="number"
                  placeholder="+1234567890"
                  value={newContact.number}
                  onChange={(e) => setNewContact({...newContact, number: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email (Optional)</label>
                <Input
                  id="email"
                  placeholder="email@example.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button 
                className="bg-sms-primary hover:bg-sms-primary/90"
                onClick={handleAddContact}
              >
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {filteredContacts.length} contacts
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Last Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
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
                      <td className="px-4 py-3 text-sm hidden md:table-cell">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                        {contact.lastContact}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sms-accent/30 text-sms-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setEditingContact({...contact})}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Contact</DialogTitle>
                                <DialogDescription>
                                  Update the contact information below.
                                </DialogDescription>
                              </DialogHeader>
                              {editingContact && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                                    <Input
                                      id="edit-name"
                                      value={editingContact.name}
                                      onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <label htmlFor="edit-number" className="text-sm font-medium">Phone Number</label>
                                    <Input
                                      id="edit-number"
                                      value={editingContact.number}
                                      onChange={(e) => setEditingContact({...editingContact, number: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                                    <Input
                                      id="edit-email"
                                      value={editingContact.email}
                                      onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingContact(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  className="bg-sms-primary hover:bg-sms-primary/90"
                                  onClick={handleEditContact}
                                >
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Delete Contact</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this contact? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleDeleteContact(contact.id, contact.name)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
