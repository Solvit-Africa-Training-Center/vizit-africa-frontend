"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from "@/components/ui/stepper";
import { RiInformationLine } from "@remixicon/react";

export default function ShowcasePage() {
  return (
    <div className="p-10 space-y-12 max-w-4xl mx-auto bg-background min-h-screen">
      <h1 className="font-display text-4xl font-bold">
        Component Showcase (Sharp Editorial)
      </h1>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="editorial">Editorial</Button>
          <Button variant="link-hover">Link Hover</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Badges
        </h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="outline-sharp">Outline Sharp</Badge>
          <Badge variant="editorial">Editorial</Badge>
          <Badge variant="status">
            <span className="size-1.5 rounded-full bg-green-500 mr-1.5" />
            Status
          </Badge>
          <Badge variant="number">5</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Inputs & Textarea
        </h2>
        <div className="grid gap-4 max-w-md">
          <Input placeholder="Sharp Input..." />
          <Textarea placeholder="Sharp Textarea..." />
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm">
              Accept terms (Sharp Checkbox)
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Accordion
        </h2>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is this sharp enough?</AccordionTrigger>
            <AccordionContent>
              Yes, it uses a minimal bottom border style.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Another item?</AccordionTrigger>
            <AccordionContent>Ideally, yes.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Alert
        </h2>
        <Alert>
          <RiInformationLine className="size-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>This is a sharp alert component.</AlertDescription>
        </Alert>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Avatar
        </h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="rounded-md">
            <AvatarFallback>SQ</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Tabs
        </h2>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList variant="editorial">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account settings here.</TabsContent>
          <TabsContent value="password">Password settings here.</TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Stepper
        </h2>
        <Stepper defaultValue={1} className="w-full max-w-md">
          <StepperItem step={0}>
            <StepperTrigger>
              <StepperIndicator />
              <div className="flex flex-col items-start gap-1">
                <StepperTitle>Step 1</StepperTitle>
                <StepperDescription>Details</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem step={1}>
            <StepperTrigger>
              <StepperIndicator />
              <div className="flex flex-col items-start gap-1">
                <StepperTitle>Step 2</StepperTitle>
                <StepperDescription>Confirm</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem step={2}>
            <StepperTrigger>
              <StepperIndicator />
              <div className="flex flex-col items-start gap-1">
                <StepperTitle>Step 3</StepperTitle>
                <StepperDescription>Done</StepperDescription>
              </div>
            </StepperTrigger>
          </StepperItem>
        </Stepper>
      </section>
    </div>
  );
}
