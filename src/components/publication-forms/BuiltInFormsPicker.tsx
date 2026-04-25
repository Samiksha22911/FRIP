/**
 * Reusable picker that lets a Faculty / HOD user choose one of the three
 * built-in publication forms and submit it. Used inside Faculty "My Forms"
 * and HOD "My Research" so both roles share the exact same workflow.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Mic } from "lucide-react";
import JournalPaperForm from "./JournalPaperForm";
import ConferencePaperForm from "./ConferencePaperForm";
import BookPublicationForm from "./BookPublicationForm";

interface Props {
  defaultFaculty?: string;
  defaultDepartment?: string;
  submitterEmail: string;
  submitterRole: "faculty" | "hod";
  onSubmitted?: () => void;
}

export const BuiltInFormsPicker = (props: Props) => {
  const [tab, setTab] = useState<"journal" | "conference" | "book">("journal");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-serif">Built-in publication forms</CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit a Journal Paper, Conference Paper, or Book / Book Chapter. Required fields are marked with *.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="journal" className="gap-2">
              <FileText className="h-4 w-4" /> Journal
            </TabsTrigger>
            <TabsTrigger value="conference" className="gap-2">
              <Mic className="h-4 w-4" /> Conference
            </TabsTrigger>
            <TabsTrigger value="book" className="gap-2">
              <BookOpen className="h-4 w-4" /> Book / Chapter
            </TabsTrigger>
          </TabsList>
          <TabsContent value="journal">
            <JournalPaperForm {...props} />
          </TabsContent>
          <TabsContent value="conference">
            <ConferencePaperForm {...props} />
          </TabsContent>
          <TabsContent value="book">
            <BookPublicationForm {...props} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BuiltInFormsPicker;
