
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Download } from "lucide-react";
import { ConfirmationStepProps } from "@/interfaces/interfaces_All";

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    marginBottom: 20,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
  },
  label: {
    color: '#71717a',
  },
  value: {
    fontWeight: 'medium',
  },
  bookingId: {
    fontFamily: 'Courier',
    backgroundColor: '#f4f4f5',
    padding: 5,
    borderRadius: 4,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#a1a1aa',
  },
});

// PDF Document Component
const InvoicePDF = ({ movie, cinema, showtime, selectedSeats, grandTotal, bookingId }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking Confirmation</Text>
        <Text style={styles.subtitle}>Your tickets have been booked successfully</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Movie</Text>
          <Text style={styles.value}>{movie.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cinema</Text>
          <Text>{cinema?.name || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date & Time</Text>
          <Text>{showtime ? `${showtime.time}, Today` : 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Seats</Text>
          <Text>{selectedSeats.map((seat) => (seat.seatRow || "") + seat.seatNumber).join(", ")}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount Paid</Text>
          <Text style={styles.value}>₹{grandTotal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.bookingId}>{bookingId}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text>A confirmation has been sent to your email and mobile number</Text>
      </View>
    </Page>
  </Document>
);

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  movie,
  cinema,
  showtime,
  selectedSeats,
  grandTotal,
  onClose,
}) => {
  // Generate booking ID
  const bookingId = `INOX${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  return (
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">Your tickets have been booked successfully</p>
      
      <Card className="w-full max-w-md mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Movie</span>
              <span className="font-medium">{movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Cinema</span>
              <span>{cinema?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Date & Time</span>
              <span>{showtime ? `${showtime.time}, Today` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Seats</span>
              <span>{selectedSeats.map((seat) => (seat.seatRow || "") + seat.seatNumber).join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Amount Paid</span>
              <span className="font-medium">₹{grandTotal}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">Booking ID</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                  {bookingId}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-sm text-zinc-500 mb-6">
        A confirmation has been sent to your email and mobile number
      </p>
      
      <div className="flex gap-4">
        <Button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700"
        >
          Done
        </Button>
        
        <PDFDownloadLink
          document={
            <InvoicePDF 
              movie={movie}
              cinema={cinema}
              showtime={showtime}
              selectedSeats={selectedSeats}
              grandTotal={grandTotal}
              bookingId={bookingId}
            />
          }
          fileName={`Booking_${bookingId}.pdf`}
        >
          {({ loading }) => (
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              {loading ? 'Generating...' : 'Download Invoice'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default ConfirmationStep;