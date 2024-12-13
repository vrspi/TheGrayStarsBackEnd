-- Create trigger for gallery table
CREATE TRIGGER tr_gallery_update
ON gallery
AFTER UPDATE
AS
BEGIN
    UPDATE gallery
    SET updated_at = GETDATE()
    FROM gallery g
    INNER JOIN inserted i ON g.id = i.id;
END;

-- Create trigger for music table
CREATE TRIGGER tr_music_update
ON music
AFTER UPDATE
AS
BEGIN
    UPDATE music
    SET updated_at = GETDATE()
    FROM music m
    INNER JOIN inserted i ON m.id = i.id;
END;

-- Create trigger for band_members table
CREATE TRIGGER tr_band_members_update
ON band_members
AFTER UPDATE
AS
BEGIN
    UPDATE band_members
    SET updated_at = GETDATE()
    FROM band_members b
    INNER JOIN inserted i ON b.id = i.id;
END; 