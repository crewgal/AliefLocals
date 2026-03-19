CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS businesses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  owner_id CHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NULL,
  phone VARCHAR(50) NULL,
  website VARCHAR(255) NULL,
  address VARCHAR(255) NULL,
  image_url TEXT NULL,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_businesses_slug (slug),
  KEY idx_businesses_category (category),
  CONSTRAINT fk_businesses_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id CHAR(36) NOT NULL PRIMARY KEY,
  business_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_reviews_business_user (business_id, user_id),
  KEY idx_reviews_business_id (business_id),
  KEY idx_reviews_user_id (user_id),
  CONSTRAINT fk_reviews_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  content TEXT NULL,
  media_url TEXT NULL,
  media_type VARCHAR(20) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_posts_user_id (user_id),
  KEY idx_posts_created_at (created_at),
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_comments_post_id (post_id),
  KEY idx_comments_user_id (user_id),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS likes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_likes_post_user (post_id, user_id),
  KEY idx_likes_post_id (post_id),
  KEY idx_likes_user_id (user_id),
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS friendships (
  id CHAR(36) NOT NULL PRIMARY KEY,
  requester_id CHAR(36) NOT NULL,
  addressee_id CHAR(36) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_friendships_pair (requester_id, addressee_id),
  KEY idx_friendships_addressee (addressee_id),
  CONSTRAINT fk_friendships_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_friendships_addressee FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `groups` (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  cover_image_url TEXT NULL,
  created_by CHAR(36) NULL,
  is_public TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_groups_created_by (created_by),
  CONSTRAINT fk_groups_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS group_members (
  id CHAR(36) NOT NULL PRIMARY KEY,
  group_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_group_members_group_user (group_id, user_id),
  KEY idx_group_members_user_id (user_id),
  CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conversations (
  id CHAR(36) NOT NULL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conversation_participants (
  id CHAR(36) NOT NULL PRIMARY KEY,
  conversation_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_conversation_participants (conversation_id, user_id),
  KEY idx_conversation_participants_user_id (user_id),
  CONSTRAINT fk_conversation_participants_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_conversation_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id CHAR(36) NOT NULL PRIMARY KEY,
  conversation_id CHAR(36) NOT NULL,
  sender_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_messages_conversation_id (conversation_id),
  KEY idx_messages_sender_id (sender_id),
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO businesses (
  id, owner_id, name, slug, category, description, phone, website, address, image_url, verified
) VALUES
  (
    '8c43b263-5f0d-4f7f-9f53-287bb58ff93a',
    NULL,
    'Infinity Coordinator',
    'infinity-coordinator',
    'real-estate',
    'A long-running local service business focused on personalized travel and event coordination for families in the Alief area.',
    '(843) 364-8057',
    'https://example.com',
    'Alief, Houston, TX',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop',
    1
  ),
  (
    'eff54343-f566-4386-b533-e05d1a7984be',
    NULL,
    'Alief Family Dental',
    'alief-family-dental',
    'dentists',
    'Neighborhood dental care with a focus on family appointments and preventive treatment.',
    '(281) 555-0133',
    'https://example.com/dental',
    '12500 Bellaire Blvd, Houston, TX',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&h=600&fit=crop',
    1
  ),
  (
    '5d9404ed-9dbd-4f93-88c0-8136c8f4df1e',
    NULL,
    'Bellaire Auto Care',
    'bellaire-auto-care',
    'mechanics',
    'General repairs, diagnostics, and routine maintenance for daily drivers.',
    '(281) 555-0198',
    'https://example.com/auto',
    '10421 Bellaire Blvd, Houston, TX',
    'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=500&h=600&fit=crop',
    1
  ),
  (
    '62121b72-65be-4f56-bd27-c67a9f65ab2d',
    NULL,
    'Westchase Barber Lounge',
    'westchase-barber-lounge',
    'barber-shops',
    'Classic cuts, beard trims, and walk-in appointments for the neighborhood.',
    '(713) 555-0161',
    'https://example.com/barber',
    '11200 Westheimer Rd, Houston, TX',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=500&h=600&fit=crop',
    0
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  description = VALUES(description),
  phone = VALUES(phone),
  website = VALUES(website),
  address = VALUES(address),
  image_url = VALUES(image_url),
  verified = VALUES(verified);
