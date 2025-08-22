import { Link } from 'react-router-dom';

import { ROUTES } from '../constants';


export default function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to={ROUTES.introduction}>
        Back to introduction tab
      </Link>
    </div>
  );
}
