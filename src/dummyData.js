// Dummy data generator for class scheduling
export const generateDummyData = () => {
    const locations = [
        'Downtown Studio',
        'Uptown Studio',
        'Eastside Gym',
        'Westside Wellness',
        'Central Park Fitness',
        'Riverside Center'
    ];

    const trainers = [
        'John Doe',
        'Jane Smith',
        'Mike Johnson',
        'Sarah Wilson',
        'David Brown',
        'Emma Davis',
        'Chris Taylor',
        'Lisa Anderson',
        'Tom Wilson',
        'Amy Clark'
    ];

    const categories = [
        'Yoga',
        'Pilates',
        'Zumba',
        'Strength Training',
        'Cardio',
        'HIIT',
        'Meditation',
        'Spinning',
        'Martial Arts',
        'Dance'
    ];

    const sessionTypes = [
        'Group',
        'Private',
        'Semi-Private',
        'Workshop',
        'Masterclass'
    ];

    const classNames = {
        'Yoga': ['Morning Flow', 'Power Yoga', 'Gentle Yoga', 'Restorative Yoga', 'Vinyasa Flow'],
        'Pilates': ['Mat Pilates', 'Reformer Pilates', 'Pilates Fusion', 'Core Pilates'],
        'Zumba': ['Zumba Fitness', 'Zumba Gold', 'Zumba Strong', 'Aqua Zumba'],
        'Strength Training': ['Body Pump', 'Kettlebell Training', 'Functional Training', 'Olympic Lifting'],
        'Cardio': ['Cardio Blast', 'Step Aerobics', 'Cardio Kickboxing', 'Dance Cardio'],
        'HIIT': ['HIIT Circuit', 'Tabata Training', 'Boot Camp', 'Metabolic Conditioning'],
        'Meditation': ['Mindfulness Session', 'Guided Meditation', 'Breathing Workshop'],
        'Spinning': ['Indoor Cycling', 'Spin & Strength', 'Endurance Ride', 'Hill Climb'],
        'Martial Arts': ['Kickboxing', 'Taekwondo', 'Karate', 'Self Defense'],
        'Dance': ['Hip Hop', 'Contemporary', 'Ballet Fitness', 'Latin Dance']
    };

    const descriptions = {
        'Yoga': 'Focus on flexibility, strength, and mindfulness through flowing movements.',
        'Pilates': 'Core-focused exercises that improve posture, flexibility, and strength.',
        'Zumba': 'High-energy dance fitness combining Latin rhythms with easy-to-follow moves.',
        'Strength Training': 'Build muscle and increase strength through resistance exercises.',
        'Cardio': 'Heart-pumping workouts to improve cardiovascular fitness and endurance.',
        'HIIT': 'High-intensity interval training for maximum calorie burn and fitness gains.',
        'Meditation': 'Mindfulness and relaxation techniques to reduce stress and improve focus.',
        'Spinning': 'Indoor cycling workouts with varying intensity and terrain simulation.',
        'Martial Arts': 'Learn self-defense techniques while improving fitness and discipline.',
        'Dance': 'Fun, rhythmic movements that combine fitness with artistic expression.'
    };

    const timeSlots = [
        '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
        '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
    ];

    const durations = ['30 mins', '45 mins', '60 mins', '75 mins', '90 mins'];

    const classes = [];
    let id = 1;

    // Generate classes for the next 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);

        // Generate 8-15 classes per day
        const classesPerDay = Math.floor(Math.random() * 8) + 8;

        for (let i = 0; i < classesPerDay; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const trainer = trainers[Math.floor(Math.random() * trainers.length)];
            const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
            const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            const duration = durations[Math.floor(Math.random() * durations.length)];
            const className = classNames[category][Math.floor(Math.random() * classNames[category].length)];

            classes.push({
                id: id.toString(),
                name: className,
                date: date.toISOString().split('T')[0],
                time: time,
                location: location,
                trainer: trainer,
                category: category,
                sessionType: sessionType,
                duration: duration,
                description: descriptions[category],
                additionalInfo: sessionType === 'Private'
                    ? 'One-on-one personalized training session'
                    : sessionType === 'Workshop'
                        ? 'Special workshop with extended duration and detailed instruction'
                        : 'Regular group class with certified instructor'
            });

            id++;
        }
    }

    // Add some duplicate time slots for demonstration
    const duplicateTimeSlots = ['9:00 AM', '6:00 PM', '7:00 PM'];
    duplicateTimeSlots.forEach(time => {
        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 7)); // Next week

            const category = categories[Math.floor(Math.random() * categories.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const trainer = trainers[Math.floor(Math.random() * trainers.length)];
            const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
            const duration = durations[Math.floor(Math.random() * durations.length)];
            const className = classNames[category][Math.floor(Math.random() * classNames[category].length)];

            classes.push({
                id: id.toString(),
                name: className,
                date: date.toISOString().split('T')[0],
                time: time,
                location: location,
                trainer: trainer,
                category: category,
                sessionType: sessionType,
                duration: duration,
                description: descriptions[category],
                additionalInfo: sessionType === 'Private'
                    ? 'One-on-one personalized training session'
                    : sessionType === 'Workshop'
                        ? 'Special workshop with extended duration and detailed instruction'
                        : 'Regular group class with certified instructor'
            });

            id++;
        }
    });

    return classes.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
    });
  };