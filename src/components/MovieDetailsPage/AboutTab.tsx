import { AboutTabProps } from "@/interfaces/interfaces_All";
import { Card, CardContent } from "../ui/card";
import { TabsContent } from "../ui/tabs";


const AboutTab:React.FC<AboutTabProps> = ({ movie }) => {

    return (
        <TabsContent value="about">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">About the Movie</h2>
            <p className="mb-4">{movie.description}</p>
            <p className="mb-4">
              Directed by <span className="font-medium">{movie.director}</span>.
            </p>
            <h3 className="text-lg font-medium mb-2">Cast</h3>
            <ul className="space-y-2">
              {movie.cast.map((actor, i) => (
                <li key={i}>{actor}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    )
}
export default AboutTab;