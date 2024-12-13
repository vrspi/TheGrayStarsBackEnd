-- Initial Music Data
INSERT INTO music (title, artist, album, release_date, audio_url, cover_image_url) VALUES
('Show', 'Ado', 'The First Take', '2023-01-01', 'https://www.youtube.com/watch?v=1NS0d4JeBGM', 'https://img.youtube.com/vi/1NS0d4JeBGM/maxresdefault.jpg'),
('New Genesis', 'Ado', 'The First Take', '2023-01-01', 'https://www.youtube.com/watch?v=Nb7IR7CfzRE', 'https://img.youtube.com/vi/Nb7IR7CfzRE/maxresdefault.jpg');

-- Initial Band Members Data
INSERT INTO band_members (name, role, bio, image_url, social_links, display_order) VALUES
('Hicham Bilali', 'Vocals', 'Lead vocalist of TheGrayStars with a powerful and dynamic voice.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', 
  JSON_OBJECT(
    'instagram', '#',
    'twitter', '#',
    'facebook', '#'
  ),
1),
('Abdel Housni', 'Bass', 'Master of the low end, providing the groove and foundation of the band.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800',
  JSON_OBJECT(
    'instagram', '#',
    'twitter', '#',
    'facebook', '#'
  ),
2),
('David Mouyal', 'Guitar', 'Innovative guitarist bringing unique melodies and textures to the music.', 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=800',
  JSON_OBJECT(
    'instagram', '#',
    'twitter', '#',
    'facebook', '#'
  ),
3),
('Mourad Housni', 'Keyboard', 'Versatile keyboardist adding rich harmonies and atmospheric layers.', 'https://images.unsplash.com/photo-1552056739-587704e36b05?q=80&w=800',
  JSON_OBJECT(
    'instagram', '#',
    'twitter', '#',
    'facebook', '#'
  ),
4),
('Ridouan Housni', 'Percussion', 'Talented percussionist bringing additional rhythmic dimensions to the band.', 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=800',
  JSON_OBJECT(
    'instagram', '#',
    'twitter', '#',
    'facebook', '#'
  ),
5),
('Marc Van Eyck', 'Drums', 'Skilled drummer driving the rhythm section with precision and creativity.', 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800',
  JSON_OBJECT(
    'instagram', '#',
    'twitter', '#',
    'facebook', '#'
  ),
6); 