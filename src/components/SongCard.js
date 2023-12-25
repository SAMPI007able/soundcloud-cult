import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Avatar, Skeleton, Typography } from "@mui/material";
import useStyles from "../utility/useStyles";
function SongCard({ details }) {
    const mdUITypography = useStyles()
    return (
        <Box >
            <Card style={{height: '100%'}} variant="outlined" className={mdUITypography.card}>
                    {!details.coverPic ? (
                        <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
                    ) : (
                        <Avatar className={mdUITypography.avatar} sx={{ height: '100%', width: '100%'}} variant="rounded" src={details.coverPic}></Avatar>
                    )}
                        <section className="card-texts">
                            <Typography variant="subtitle1" display="block" gutterBottom style={mdUITypography.typography}>
                                {details.name}
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom style={mdUITypography.typography}>
                                {details.artist?.name ?? details.summary}
                            </Typography>
                        </section>
            </Card>
        </Box>
    );
}

export default SongCard;
