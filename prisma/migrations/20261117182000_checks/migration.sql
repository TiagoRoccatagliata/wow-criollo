-- Keep database invariants even when future writers bypass the web form.
ALTER TABLE "GroupPost"
  ADD CONSTRAINT "GroupPost_level_check" CHECK ("level" BETWEEN 1 AND 60),
  ADD CONSTRAINT "GroupPost_recommendedLevel_check" CHECK ("recommendedLevel" BETWEEN 1 AND 60),
  ADD CONSTRAINT "GroupPost_playersNeeded_check" CHECK ("playersNeeded" BETWEEN 1 AND 39),
  ADD CONSTRAINT "GroupPost_name_length_check" CHECK (char_length(trim("characterName")) >= 2),
  ADD CONSTRAINT "GroupPost_description_length_check" CHECK (char_length(trim("description")) >= 20);
ALTER TABLE "RateLimitBucket" ADD CONSTRAINT "RateLimitBucket_count_check" CHECK ("count" >= 1);
