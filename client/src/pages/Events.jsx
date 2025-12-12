import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// removed Google Maps picker import - MapPicker removed from modal

const cardData = [
  {
    title: "SUSS Discovery Dinner",
    // place your flyer image in `client/public/img/sussdinner.jpeg` and reference it as below
    image: "/img/sussdinner.jpeg",
    body: "Networking dinner event for SUSS students to learn about Social Capital.",
    date: "27 November 2025",
    time: "6:30 PM",
    venue: "JustCo@TheCentrepoint",
    leftover: [
      "Vegetarian Beehoon",
      "Cereal Prawn Fish",
      "Curry Chicken",
      "Aloe Vera Jelly",
    ],
  },
  {
    title: "AWS Thriving in the Age of AI",
    image: "/img/aws.png",
    body: "A Panel Session on the future of AI and its impact on businesses and society.",
    date: "17 September 2025",
    time: "7:00 PM",
    venue: "Amazon Web Services Singapore Pte Ltd",
    leftover: ["Rice", "Beehoon", "Chicken", "Fish", "Salad", "Dumplings"],
  },
  {
    title: "SUSS ICT Career Workshop",
    image: "/img/sussict.jpeg",
    body: "Fresh produce, chef pop-ups and tasting sessions with local farmers.",
    date: "17 September 2025",
    time: "1:00 PM",
    venue: "Singapore University of Social Sciences",
    leftover: ["Fried Rice", "Noodles", "Chicken", "Prawns", "Vegetables"],
  },
];

function Events() {
  const [openImage, setOpenImage] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const navigate = useNavigate();

  // events state persisted in localStorage
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem("events");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // ensure seeded events have stable ids
    return cardData.map((e, i) => ({ id: e.id ?? `seed-${i}`, ...e }));
  });

  useEffect(() => {
    try {
      localStorage.setItem("events", JSON.stringify(events));
    } catch (e) {}
  }, [events]);

  // Add event dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    body: "",
    leftover: "",
    lat: "",
    lng: "",
    image: "",
  });

  const openAdd = () => setAddOpen(true);
  const closeAdd = () => setAddOpen(false);

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr && !timeStr) return null;
    // format date: if ISO YYYY-MM-DD, convert to 'D Month YYYY', otherwise use as-is
    let dateFormatted = "";
    if (dateStr) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        try {
          const d = new Date(dateStr + "T00:00:00");
          dateFormatted = d.toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        } catch (e) {
          dateFormatted = dateStr;
        }
      } else {
        dateFormatted = dateStr;
      }
    }

    // format time: already has AM/PM or is 24h 'HH:MM'
    let timeFormatted = "";
    if (timeStr) {
      const t = String(timeStr).trim();
      const ampmMatch = t.match(/(am|pm)/i);
      if (ampmMatch) {
        timeFormatted = t.replace(/\s*/g, "").toLowerCase();
      } else if (/^\d{1,2}:\d{2}$/.test(t)) {
        const [hh, mm] = t.split(":").map(Number);
        const hour12 = hh % 12 === 0 ? 12 : hh % 12;
        const ampm = hh >= 12 ? "pm" : "am";
        timeFormatted = `${hour12}:${String(mm).padStart(2, "0")}${ampm}`;
      } else {
        timeFormatted = t;
      }
    }

    if (dateFormatted && timeFormatted)
      return `${dateFormatted} ${timeFormatted}`;
    return dateFormatted || timeFormatted || null;
  };

  const handleFormChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleFormChange("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitAdd = () => {
    const leftovers = form.leftover
      ? form.leftover
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const newEvent = {
      id: Date.now(),
      title: form.title || "Untitled",
      image: form.image || "https://via.placeholder.com/400x160?text=Event",
      body: form.body || "",
      date: form.date || "",
      time: form.time || "",
      venue: form.venue || "",
      leftover: leftovers,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm({
      title: "",
      date: "",
      time: "",
      venue: "",
      body: "",
      leftover: "",
      image: "",
    });
    closeAdd();
  };

  // Note: Map picker removed from modal - user requested simpler form without lat/lng

  const openImageDialog = (src, title) => {
    setCurrentImage({ src, title });
    setOpenImage(true);
  };

  const closeImageDialog = () => {
    setOpenImage(false);
    setCurrentImage(null);
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={openAdd}
            sx={{
              backgroundColor: "#E8871E",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc7419" },
            }}
          >
            Add Event
          </Button>
        </Grid>
        {events.map((c, idx) => (
          <Grid item key={idx} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                image={c.image}
                alt={c.title}
                onClick={() => openImageDialog(c.image, c.title)}
                sx={{
                  width: "100%",
                  height: 300,
                  objectFit: "contain",
                  bgcolor: "#f5f5f5",
                  cursor: "pointer",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {c.title}
                </Typography>
                {(() => {
                  const dt = formatDateTime(c.date, c.time);
                  return dt ? (
                    <Typography variant="subtitle2" color="text.primary">
                      {dt}
                    </Typography>
                  ) : null;
                })()}
                {c.venue && (
                  <Typography variant="subtitle2" color="text.primary">
                    Venue: {c.venue}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                  sx={{ whiteSpace: "normal", mt: 1 }}
                >
                  {c.body}
                </Typography>
                {c.leftover && (
                  <div style={{ marginTop: 8 }}>
                    <Typography component="div" sx={{ fontWeight: "bold" }}>
                      Leftover Food
                    </Typography>
                    <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                      {(c.leftover || []).map((item, i) => (
                        <li key={i} style={{ lineHeight: 1.6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#E8871E",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#cc7419" },
                  }}
                  onClick={() => {
                    // Open Google Maps directly in a new tab. Prefer lat/lng if available, otherwise search by venue or title.
                    let url;
                    if (c.lat != null && c.lng != null) {
                      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        c.lat + "," + c.lng
                      )}`;
                    } else {
                      const q = c.venue || c.title || "";
                      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        q
                      )}`;
                    }
                    window.open(url, "_blank", "noopener");
                  }}
                >
                  View Map
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Event dialog */}
      <Dialog open={addOpen} onClose={closeAdd} fullWidth maxWidth="sm">
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => handleFormChange("date", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => handleFormChange("time", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Venue"
              value={form.venue}
              onChange={(e) => handleFormChange("venue", e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.body}
              onChange={(e) => handleFormChange("body", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Leftover (comma-separated)"
              value={form.leftover}
              onChange={(e) => handleFormChange("leftover", e.target.value)}
              fullWidth
            />
            {/* latitude/longitude inputs removed per request */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageFile(e.target.files?.[0])}
            />

            {/* embedded map picker removed */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdd}>Cancel</Button>
          <Button
            variant="contained"
            onClick={submitAdd}
            sx={{
              backgroundColor: "#E8871E",
              color: "#fff",
              "&:hover": { backgroundColor: "#cc7419" },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image lightbox dialog */}
      <Dialog open={openImage} onClose={closeImageDialog} maxWidth="lg">
        <IconButton
          aria-label="close"
          onClick={closeImageDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 2, bgcolor: "background.paper" }}>
          {currentImage && (
            <img
              src={currentImage.src}
              alt={currentImage.title}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Events;
