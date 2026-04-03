import { Tooltip, IconButton, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const TextWithTooltip = ({ text, maxLength = 50 }) => {
    if (!text || text.length <= maxLength) {
        return <span>{text}</span>;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span>{text.substring(0, maxLength)}...</span>
            <Tooltip title={text} arrow>
                <InfoIcon sx={{ fontSize: '1rem', cursor: 'pointer', color: 'primary.main' }} />
            </Tooltip>
        </Box>
    );
};