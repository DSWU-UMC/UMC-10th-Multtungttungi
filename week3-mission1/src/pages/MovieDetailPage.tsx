import { useParams } from "react-router-dom";
import type { MovieDetail } from "../types/movies";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = () : Element => {
    const params = useParams();
    const movieId = params.movieId;

    const { data: movieData, isPending: isMoviePending, isError: isMovieError } = 
        useCustomFetch<MovieDetail>(`/movie/${movieId}?language=ko-KR`);

    const { data: creditsData, isPending: isCreditsPending, isError: isCreditsError } = 
        useCustomFetch<any>(`/movie/${movieId}/credits?language=ko-KR`);

    const isPending = isMoviePending || isCreditsPending;
    const isError = isMovieError || isCreditsError;
    console.log("전달된 movieId:", movieId);

    const movie = movieData;
    const castData = creditsData?.cast || [];
    const crewData = creditsData?.crew || [];
    const director = crewData.find((person: any) => person.job === "Director");
    
    let castList = [...castData];
    if (director) {
        castList = [{ ...director, character: 'Director' }, ...castData];
    }
    const displayCast = castList.slice(0, 10);

    if (isError) {
        return (
             <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
            </div>
        );
    }
    return (
        <>
        {isPending && (
        <div className='flex items-center justify-center h-dvh'>
        <LoadingSpinner />
        </div>
        )}
    <div className='min-h-screen bg-[#141414] text-white p-10'>
        {!isPending && movie && (
        <>
           <div 
            className='relative h-[550px] w-full bg-cover bg-center flex items-center'
            style={{ 
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.1) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` 
            }}
            >
            <div className='max-w-6xl mx-auto w-full px-10 z-10'>
                <h1 className='text-6xl font-black mb-4 tracking-tighter'>{movie.title}</h1>
            <div className='flex gap-4 text-lg mb-6 text-gray-300 font-medium'>
                <span className='text-[#dda5e3] font-bold'>평균 {movie.vote_average.toFixed(1)}</span>
                <span>{movie.release_date?.split('-')[0]}</span>
                <span>{movie.runtime}분</span>
            </div>
            <p className='text-xl leading-relaxed max-w-2xl line-clamp-5 text-gray-200 font-light'>
                {movie.overview || "등록된 줄거리가 없습니다."}
            </p>
        </div>
        </div>
    <div className='flex gap-12'>
        <div className='flex-shrink-0'>
            <img 
            className='w-[350px] rounded-2xl shadow-2xl border border-gray-800'
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} />
        </div>
    <div className='flex-1 py-4'>
        <div className='flex items-center gap-5 mb-8 text-xl font-medium'>
            <span className='text-[#dda5e3]'>평점 {movie.vote_average.toFixed(1)}</span>
            <span className='text-gray-600'>|</span>
            <span>{movie.release_date}</span>
            <span className='text-gray-600'>|</span>
            <span>{movie.runtime}분</span>
        </div>
    <div className='flex flex-wrap gap-3 mb-10'>
        {movie.genres.map((genre) => (
        <span 
            key={genre.id} 
            className='bg-[#333] px-4 py-1.5 rounded-lg text-sm font-semibold border border-gray-700'>
            {genre.name}    
            </span>
            ))}
    </div>
        <h2 className='text-3xl font-bold mb-5 border-l-4 border-[#dda5e3] pl-4'>줄거리</h2>
        <p className='text-gray-300 leading-relaxed text-xl font-light max-w-3xl'>
            {movie.overview || "등록된 줄거리가 없습니다."}
        </p>
        </div>
        </div>
    <div className='max-w-6xl mx-auto p-10'>
        <h3 className='text-3xl font-bold mb-10 border-l-4 border-[#dda5e3] pl-4'>감독/출연</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-x-4 gap-y-8'>
            {displayCast.map((person) => (
            <div key={`${person.id}-${person.character}`} className='flex flex-col items-center text-center group'>
                <div className='w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-800 shadow-xl bg-gray-900'>
                    <img 
                    src={person.profile_path 
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}` 
                        : 'https://via.placeholder.com/200x200?text=No+Image'} 
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    alt={person.name}/>
                    </div>
                        <p className='text-[13px] font-bold truncate w-full mb-0.5'>{person.name}</p>
                    <p className='text-[11px] text-gray-400 truncate w-full font-light'>{person.character}</p>
                </div>
                ))}
                </div>
                </div>
                </>
            )}
        </div>
        </>
    );
};

export default MovieDetailPage;