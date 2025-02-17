import { useState } from 'react';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Link,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Logout as LogoutIcon,
  MessageRounded as MessageRoundedIcon,
} from '@mui/icons-material';

import {
  useWidgetParams,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_TEXT_COLOR,
  PICKERS,
} from '@context/widget';
import { useAppData } from '@context/app';
import { getRgbaColor } from './utils';


function Widget() {
  const [isOpen, setIsOpen] = useState(true);
  const { widgetParams } = useWidgetParams();
  const { appData } = useAppData();
  const textDecorationColor = getRgbaColor(`#${widgetParams.widget[PICKERS.ACCENT]}` || `#${DEFAULT_ACCENT_COLOR}`, 0.5);
  const widgetAccentColor = `#${widgetParams.widget[PICKERS.ACCENT]}` || `#${DEFAULT_ACCENT_COLOR}`;

  if (!isOpen) {
    return (
      <IconButton
        aria-label="delete"
        size="large"
        className="WidgetCollapsedBtn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: widgetAccentColor }}
      >
        <MessageRoundedIcon fontSize="inherit" />
      </IconButton>
    );
  }

  return (
    <Accordion
      expanded
      className="WidgetAccordion"
      onChange={() => setIsOpen(!isOpen)}
      style={{ width: `${widgetParams.widget.width}px`, height: `${widgetParams.widget.height}px` }}
    >
      <AccordionSummary
        id="widget-header"
        className="WidgetAccordion__Header"
        expandIcon={<ExpandMoreIcon />}
        aria-controls="Widget header"
        style={{ backgroundColor: `#${widgetParams.widget[PICKERS.ACCENT]}` || `#${DEFAULT_ACCENT_COLOR}` }}
      >
        <IconButton disabled size="large">
          <LogoutIcon className="WidgetAccordion__Header__LogoutIcon" />
        </IconButton>
        <Avatar className="WidgetAccordion__Header__img" alt="Widget avatar" src={appData.avatar} />
        <Box className="WidgetAccordion__Header__Info">
          <Typography className="WidgetAccordion__Header__Info-title">
            {widgetParams.widget.name}
          </Typography>
          <Typography className="WidgetAccordion__Header__Info-subtitle" variant="subtitle2">
            {widgetParams.widget.description}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        className="WidgetAccordion__Details"
        style={{ backgroundColor: `#${widgetParams.widget[PICKERS.BACKGROUND]}` || `${DEFAULT_BACKGROUND_COLOR}` }}
      >
        <Typography
          className="WidgetAccordion__Details__Text"
          style={{ color: `#${widgetParams.widget[PICKERS.TEXT]}` || `#${DEFAULT_TEXT_COLOR}` }}
        >
          {widgetParams.widget.greetingString}
        </Typography>
      </AccordionDetails>
      <TextField
        className="WidgetAccordion__Input"
        variant="outlined"
        size="small"
        placeholder="Type your message here..."
        fullWidth
        disabled
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="submit" edge="end" disabled>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box className="WidgetAccordion__Input__Border" style={{ backgroundColor: `#${widgetParams.widget[PICKERS.ACCENT]}` }} />
      <Box className="WidgetAccordion__PoweredBy" style={{ backgroundColor: `#${widgetParams.widget[PICKERS.BACKGROUND]}` }}>
        <span>Powered by</span>
        <Link
          className="WidgetAccordion__PoweredBy__Link"
          href="https://www.ibm.com/products/watsonx-ai"
          target="_blank"
          underline="always"
          rel="noreferrer"
          style={{ color: `#${widgetParams.widget[PICKERS.ACCENT]}`, textDecorationColor }}
        >
          IBM watsonx.ai
        </Link>
      </Box>
    </Accordion>
  );
}

export default Widget;
