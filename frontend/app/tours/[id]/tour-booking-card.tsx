"use client"

import { useState } from "react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Users, Shield, Phone, User, Mail, MessageSquare, Baby, Minus, Plus, Check } from "lucide-react"
import type { Tour } from "@/lib/tours-data"

interface TourBookingCardProps {
  tour: Tour
}

export function TourBookingCard({ tour }: TourBookingCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    specialRequirements: "",
  })

  // Minimum date is tomorrow
  const minDate = addDays(startOfDay(new Date()), 1)
  
  // Disable dates before tomorrow
  const disabledDays = (date: Date) => {
    return isBefore(date, minDate)
  }

  // Pricing
  const childDiscount = 0.5 // 50% off for children (2-11 years)
  const infantPrice = 0 // Free for infants (0-2 years)
  
  const adultTotal = tour.price * adults
  const childTotal = tour.price * childDiscount * children
  const infantTotal = infantPrice * infants
  const totalPrice = adultTotal + childTotal + infantTotal
  const totalTravelers = adults + children + infants

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    // Reset after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false)
      setIsBookingOpen(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        specialRequirements: "",
      })
    }, 3000)
  }

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setIsEnquiryOpen(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        specialRequirements: "",
      })
    }, 3000)
  }

  const TravelerCounter = ({
    label,
    description,
    value,
    onDecrease,
    onIncrease,
    min = 0,
    max = 12,
    icon: Icon,
  }: {
    label: string
    description: string
    value: number
    onDecrease: () => void
    onIncrease: () => void
    min?: number
    max?: number
    icon: React.ElementType
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-input bg-background hover:bg-muted transition-colors text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-medium text-foreground w-6 text-center">
          {value}
        </span>
        <button
          onClick={onIncrease}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-input bg-background hover:bg-muted transition-colors text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label={`Increase ${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const BookingForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {formSubmitted ? (
        <div className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground mb-2">Request Submitted!</h3>
          <p className="text-muted-foreground">We&apos;ll contact you within 24 hours to confirm your booking.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="United States"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              placeholder="Dietary restrictions, accessibility needs, room preferences..."
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Booking Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-foreground">Booking Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tour:</span>
                <span className="text-foreground font-medium">{tour.title}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground">{format(selectedDate, "PPP")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Travelers:</span>
                <span className="text-foreground">
                  {adults} Adult{adults !== 1 && "s"}
                  {children > 0 && `, ${children} Child${children !== 1 ? "ren" : ""}`}
                  {infants > 0 && `, ${infants} Infant${infants !== 1 ? "s" : ""}`}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6">
            {submitLabel}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to our Terms of Service and Privacy Policy
          </p>
        </>
      )}
    </form>
  )

  return (
    <div className="sticky top-24">
      <Card className="shadow-xl border-border">
        <CardContent className="p-6">
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-primary">
                ${tour.price.toLocaleString()}
              </span>
              <span className="text-muted-foreground">per adult</span>
            </div>
            {tour.originalPrice && (
              <p className="text-sm text-muted-foreground">
                <span className="line-through">
                  ${tour.originalPrice.toLocaleString()}
                </span>
                <span className="text-accent font-medium ml-2">
                  Save ${(tour.originalPrice - tour.price).toLocaleString()}
                </span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Children (2-11): 50% off | Infants (0-2): Free
            </p>
          </div>

          <Separator className="my-6" />

          {/* Date Selection with Calendar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Select Departure Date
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal h-12 ${
                      !selectedDate && "text-muted-foreground"
                    }`}
                  />
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Choose a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setIsCalendarOpen(false)
                  }}
                  disabled={disabledDays}
                  initialFocus
                  fromDate={minDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Travelers Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              <Users className="w-4 h-4 inline mr-2" />
              Number of Travelers
            </label>
            
            <div className="border border-input rounded-lg p-4 space-y-1">
              <TravelerCounter
                label="Adults"
                description="Age 12+"
                value={adults}
                onDecrease={() => setAdults(Math.max(1, adults - 1))}
                onIncrease={() => setAdults(Math.min(12, adults + 1))}
                min={1}
                max={12}
                icon={User}
              />
              
              <Separator />
              
              <TravelerCounter
                label="Children"
                description="Age 2-11 (50% off)"
                value={children}
                onDecrease={() => setChildren(Math.max(0, children - 1))}
                onIncrease={() => setChildren(Math.min(8, children + 1))}
                min={0}
                max={8}
                icon={Users}
              />
              
              <Separator />
              
              <TravelerCounter
                label="Infants"
                description="Age 0-2 (Free)"
                value={infants}
                onDecrease={() => setInfants(Math.max(0, infants - 1))}
                onIncrease={() => setInfants(Math.min(4, infants + 1))}
                min={0}
                max={4}
                icon={Baby}
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Price Breakdown */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{adults} Adult{adults !== 1 && "s"} x ${tour.price.toLocaleString()}</span>
              <span className="text-foreground">${adultTotal.toLocaleString()}</span>
            </div>
            {children > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{children} Child{children !== 1 && "ren"} x ${(tour.price * childDiscount).toLocaleString()}</span>
                <span className="text-foreground">${childTotal.toLocaleString()}</span>
              </div>
            )}
            {infants > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{infants} Infant{infants !== 1 && "s"}</span>
                <span className="text-foreground text-primary">Free</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Total ({totalTravelers} traveler{totalTravelers !== 1 && "s"})</span>
              <span className="font-serif text-2xl font-bold text-foreground">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger render={<Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold" />}>
                Book Now
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">Complete Your Booking</DialogTitle>
                  <DialogDescription>
                    Fill in your details to book the {tour.title} tour.
                  </DialogDescription>
                </DialogHeader>
                <BookingForm onSubmit={handleBookingSubmit} submitLabel="Confirm Booking" />
              </DialogContent>
            </Dialog>

            <Dialog open={isEnquiryOpen} onOpenChange={setIsEnquiryOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6"
                  />
                }
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Enquire About This Tour
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">Send an Enquiry</DialogTitle>
                  <DialogDescription>
                    Have questions about the {tour.title}? We&apos;re here to help!
                  </DialogDescription>
                </DialogHeader>
                <BookingForm onSubmit={handleEnquirySubmit} submitLabel="Send Enquiry" />
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-6" />

          {/* Trust Signals */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span>Free cancellation up to 30 days before</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <span>24/7 customer support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card className="mt-6 bg-primary text-primary-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg text-center">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-primary-foreground/80 text-sm mb-4">
            Our travel experts are here to help you plan your perfect trip
          </p>
          <a
            href="tel:+1-800-INDIA"
            className="text-lg font-bold hover:underline flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            +1-800-INDIA-TOURS
          </a>
          <a
            href="mailto:info@incredibleindiatours.com"
            className="text-sm text-primary-foreground/80 hover:underline flex items-center justify-center gap-2 mt-2"
          >
            <Mail className="w-4 h-4" />
            info@incredibleindiatours.com
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
