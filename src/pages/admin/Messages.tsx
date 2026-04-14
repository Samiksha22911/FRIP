import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const sentMessages = [
  { id: 1, to: "All Faculty", subject: "New Form: Research Paper 2024", date: "2024-03-15" },
  { id: 2, to: "CSE Department", subject: "Deadline Extended", date: "2024-03-12" },
  { id: 3, to: "All HODs", subject: "Monthly Report Submission", date: "2024-03-10" },
];

const Messages = () => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully!");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Send notifications and messages to faculty and HODs.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Send To</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger><SelectValue placeholder="Select recipients" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-faculty">All Faculty</SelectItem>
                  <SelectItem value="all-hods">All HODs</SelectItem>
                  <SelectItem value="cse">CSE Department</SelectItem>
                  <SelectItem value="ece">ECE Department</SelectItem>
                  <SelectItem value="me">ME Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Message subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Type your message..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <Button onClick={handleSend} className="gap-2">
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Sent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentMessages.map((m) => (
                <div key={m.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{m.subject}</span>
                    <span className="text-xs text-muted-foreground">{m.date}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">To: {m.to}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
