import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
interface IOwnerImageProps {
  owner: { platformId: string; login: string; type?: string };
  className?: string;
  width?: number;
  height?: number;
}

const OwnerImage = ({ owner, width, height, className }: IOwnerImageProps) => {
  return (
    <Link href={`/github/${owner.login}`} passHref>
      <a>
        <Image
          width={width || 100}
          height={height || 100}
          src={`https://avatars.githubusercontent.com/u/${owner.platformId}?v=4`}
          alt={`عکس ${owner.login}`}
          className={classNames(
            owner?.type === 'User' ? 'rounded-full' : 'rounded-lg',
            className
          )}
        />
      </a>
    </Link>
  );
};

export default OwnerImage;
