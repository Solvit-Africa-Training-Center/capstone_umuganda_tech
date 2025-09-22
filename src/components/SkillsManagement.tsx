import React, { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2, Award, User } from 'lucide-react';
import { skillsAPI, type Skill, type UserSkill } from '../api/skills';

const SkillsManagement: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [skillsData, userSkillsData] = await Promise.all([
        skillsAPI.getSkills(),
        skillsAPI.getUserSkills()
      ]);
      setSkills(skillsData);
      setUserSkills(userSkillsData);
    } catch (error) {
      console.error('Failed to fetch skills data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    try {
      const skill = await skillsAPI.createSkill(newSkill);
      setSkills(prev => [...prev, skill]);
      setNewSkill({ name: '', description: '' });
      setShowAddSkill(false);
    } catch (error) {
      console.error('Failed to create skill:', error);
    }
  };

  const handleAddUserSkill = async (skillId: number) => {
    try {
      const userSkill = await skillsAPI.addUserSkill({ skill: skillId });
      setUserSkills(prev => [...prev, userSkill]);
    } catch (error) {
      console.error('Failed to add user skill:', error);
    }
  };

  const handleRemoveUserSkill = async (userSkillId: number) => {
    try {
      await skillsAPI.removeUserSkill(userSkillId);
      setUserSkills(prev => prev.filter(us => us.id !== userSkillId));
    } catch (error) {
      console.error('Failed to remove user skill:', error);
    }
  };

  const isSkillAdded = (skillId: number) => {
    return userSkills.some(us => us.skill.id === skillId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Skills */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Skills</h2>
          <span className="text-sm text-gray-600">{userSkills.length} skills</span>
        </div>
        
        {userSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {userSkills.map((userSkill) => (
              <div
                key={userSkill.id}
                className="flex items-center gap-2 bg-primaryColor-100 text-primaryColor-800 px-3 py-2 rounded-full"
              >
                <Award className="w-4 h-4" />
                <span className="font-medium">{userSkill.skill.name}</span>
                <button
                  onClick={() => handleRemoveUserSkill(userSkill.id)}
                  className="hover:bg-primaryColor-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills added yet. Add skills to get matched with relevant projects!</p>
        )}
      </div>

      {/* Available Skills */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Available Skills</h2>
          <button
            onClick={() => setShowAddSkill(true)}
            className="flex items-center gap-2 bg-primaryColor-600 text-white px-4 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddSkill && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newSkill.description}
                onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddSkill}
                  className="bg-primaryColor-600 text-white px-4 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors"
                >
                  Create Skill
                </button>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => {
            const isAdded = isSkillAdded(skill.id);
            return (
              <div
                key={skill.id}
                className={`p-4 border rounded-lg transition-colors ${
                  isAdded 
                    ? 'border-primaryColor-300 bg-primaryColor-50' 
                    : 'border-gray-200 hover:border-primaryColor-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{skill.name}</h3>
                  {!isAdded && (
                    <button
                      onClick={() => handleAddUserSkill(skill.id)}
                      className="text-primaryColor-600 hover:text-primaryColor-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-600">{skill.description}</p>
                )}
                {isAdded && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-primaryColor-700">
                    <User className="w-3 h-3" />
                    <span>Added to your profile</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsManagement;