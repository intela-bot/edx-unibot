import PropTypes from 'prop-types';


export default function MessageItem({ title, content }) {
  return (
    <div className="MessageItem">
      <h3 className="MessageItem__title">{title}</h3>
      <div className="MessageItem__content">{content}</div>
    </div>
  );
}

MessageItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};
