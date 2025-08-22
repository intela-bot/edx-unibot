import { useAppData } from '@context/app';
import { Avatar, Typography } from '@mui/material';
import { MessageItem } from './components';
import { messagesList } from './mock';


export default function Introduction() {
  const { appData: { avatar } } = useAppData();

  return (
    <div className="IntroductionContent">
      <Typography variant="h3" className="IntroductionContent__heading">
        TA Assistant (open source plugin for OpenEDX)
      </Typography>
      <div className="IntroductionContentWrapper">
        <Avatar
          className="Introduction__img"
          alt="AI-powered Teaching Assistan"
          src={avatar}
          height={46}
          width={46}
        />
        <div className="MessagesWrapper">
          {messagesList.map(({ title, content }) => (
            <MessageItem key={title} title={title} content={content} />
          ))}
        </div>
      </div>
    </div>
  );
}
