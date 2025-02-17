import { useState } from 'react';
import {
  Checkbox, FormControlLabel, Typography, Button,
} from '@mui/material';

import { Feedbacks } from './components';
import assistanceRankingImage from './images/assistance-ranking.png';
import assistanceFeedbackImage from './images/assistance-feedback.png';
import assistanceTimingImage from './images/assistance-timing.png';
import assistanceLanguagesSummary from './images/assistance-languages-summary.png';
import courseAssistanceSummary from './images/course-assistance-summary.png';
import performanceInformation from './images/performance-information.png';
import theMostPopularTopics from './images/the-most-popular-topics.png';


export default function Dashboard() {
  const [showFeedbacks, toggleShowFeedbacks] = useState(false);

  if (showFeedbacks) {
    return <Feedbacks onToggleShowFeedbacks={toggleShowFeedbacks} />;
  }

  return (
    <div className="DashboardContent">
      <Typography variant="h3" className="DashboardContent__heading">
        TA Dashboard
        <FormControlLabel
          control={<Checkbox disabled />}
          label="Make it home page "
        />
      </Typography>
      <div className="AssistanceStatistics favourite">
        <Typography variant="content" className="AssistanceStatistics__heading">
          Assistance Statistics
        </Typography>
        <div className="AssistanceStatistics__list">
          <img src={assistanceRankingImage} alt="Assistance Ranking Graph" width={652} />
          <div className="AssistanceFeedback">
            <Button
              variant="outlined"
              className="AssistanceFeedback__btn"
              onClick={() => toggleShowFeedbacks(true)}
            >
              Read feedbacks
            </Button>
            <img src={assistanceFeedbackImage} alt="Assistance Feedback Graph" width={800} />
          </div>
          <img src={assistanceTimingImage} alt="Assistance Timing Graph" width={385} />
        </div>
      </div>
      <div className="AssistanceStatistics">
        <div className="AssistanceStatisticsSummary__list">
          <img src={assistanceLanguagesSummary} alt="Assistance Languages Summary" width={991} />
          <img src={courseAssistanceSummary} alt="Course Assistance Summary" width={869} />
        </div>
      </div>
      <div className="AssistanceStatistics">
        <div className="AssistanceStatisticsSummary__list">
          <img src={performanceInformation} alt="Performance information" width={993} />
          <img src={theMostPopularTopics} alt="The Most Popular Topics" width={873} />
        </div>
      </div>
    </div>
  );
}
