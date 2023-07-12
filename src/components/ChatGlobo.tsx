import { Card, CardMedia, Link, Typography } from "@mui/material";

interface MessageProps {
    content: string;
    senderEmail: string;
}

export default function Message({content, senderEmail}: MessageProps) {

  return (
    <div  style={ senderEmail === "otro" ? { alignSelf: 'flex-start', maxWidth: '60%'} : { alignSelf: 'flex-end', maxWidth: '60%'}}>
        <Card elevation={1} sx={ senderEmail === "yo" ? {backgroundColor: "#BDFCC9", margin: 0.5, marginTop: 0.5, marginLeft: 5, minWidth: 80} : {backgroundColor: "#fff", margin: 1, marginRight: 5, marginTop: 0.5, minWidth: 80}}>
        <div style={{paddingRight: 15, paddingBottom: 20, paddingLeft: 10, paddingTop: 10, position: 'relative'}}>
            <Typography 
            sx={{ wordWrap: "break-word" }}
            >
            {content}
            </Typography>
        </div>
        </Card>
    </div>
  );
}